"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import { povError } from "@/lib/pov/display";
import { povService } from "@/services/pov.service";
import { useAuthStore } from "@/store/auth.store";

import type {
    ProjectDetails,
    PovProjectActivityResponse,
    PovProjectComment
} from "@/types/production-api";

const COMMENTS_LIMIT = 10;

interface ProjectState {
    key: string;
    details?: ProjectDetails;
    activity?: PovProjectActivityResponse;
    comments: PovProjectComment[];
    commentsPage: number;
    commentsTotalPages: number;
    detailsError?: string;
    activityError?: string;
    commentsError?: string;
    fetching: boolean;
}

export function usePovProject(projectId: string) {
    const accountId = useAuthStore((state) => state.user?.id);
    const initialized = useAuthStore((state) => state.isInitialized);

    const isAdmin = useAuthStore((state) =>
        Boolean(state.user?.roles.includes("admin"))
    );

    const canLoad = initialized && isAdmin && Boolean(projectId);
    const key = JSON.stringify([projectId, accountId]);

    const [pagination, setPagination] = useState({
        key,
        page: 1
    });

    const commentsPage =
        pagination.key === key ? pagination.page : 1;

    const [state, setState] = useState<ProjectState | null>(null);

    const controllerRef = useRef<AbortController | null>(null);
    const requestRef = useRef(0);

    const refresh = useCallback(async (): Promise<boolean> => {
        if (!canLoad) return false;

        controllerRef.current?.abort();

        const controller = new AbortController();
        const requestId = ++requestRef.current;

        controllerRef.current = controller;

        function isCurrentRequest() {
            const auth = useAuthStore.getState();

            return (
                !controller.signal.aborted &&
                requestRef.current === requestId &&
                auth.isInitialized &&
                auth.user?.id === accountId &&
                Boolean(auth.user?.roles.includes("admin"))
            );
        }

        setState((previous) => ({
            key,
            details: previous?.key === key ? previous.details : undefined,
            activity: previous?.key === key ? previous.activity : undefined,
            comments: previous?.key === key ? previous.comments : [],
            commentsPage:
                previous?.key === key ? previous.commentsPage : commentsPage,
            commentsTotalPages:
                previous?.key === key ? previous.commentsTotalPages : 1,
            fetching: true
        }));

        const [detailsResult, activityResult, commentsResult] =
            await Promise.allSettled([
                povService.get(projectId, controller.signal),
                povService.activity(projectId, controller.signal),
                povService.comments(
                    projectId,
                    { page: commentsPage, limit: COMMENTS_LIMIT },
                    controller.signal
                )
            ]);

        if (!isCurrentRequest()) return false;

        const lastPage =
            commentsResult.status === "fulfilled"
                ? Math.max(1, commentsResult.value.meta.totalPages)
                : 1;

        setState((previous) => {
            const existing = previous?.key === key ? previous : null;

            return {
                key,
                fetching: false,

                details:
                    detailsResult.status === "fulfilled"
                        ? detailsResult.value
                        : existing?.details,

                detailsError:
                    detailsResult.status === "rejected"
                        ? povError(detailsResult.reason, "Could not load the project.")
                        : undefined,

                activity:
                    activityResult.status === "fulfilled"
                        ? activityResult.value
                        : existing?.activity,

                activityError:
                    activityResult.status === "rejected"
                        ? povError(activityResult.reason, "Could not load activity.")
                        : undefined,

                comments:
                    commentsResult.status === "fulfilled"
                        ? commentsResult.value.data
                        : existing?.comments ?? [],

                commentsPage:
                    commentsResult.status === "fulfilled"
                        ? commentsPage
                        : existing?.commentsPage ?? commentsPage,

                commentsTotalPages:
                    commentsResult.status === "fulfilled"
                        ? lastPage
                        : existing?.commentsTotalPages ?? 1,

                commentsError:
                    commentsResult.status === "rejected"
                        ? povError(commentsResult.reason, "Could not load comments.")
                        : undefined
            };
        });

        if (
            commentsResult.status === "fulfilled" &&
            commentsPage > lastPage
        ) {
            setPagination({ key, page: lastPage });
        }

        return (
            detailsResult.status === "fulfilled" &&
            activityResult.status === "fulfilled" &&
            commentsResult.status === "fulfilled"
        );
    }, [accountId, canLoad, commentsPage, key, projectId]);

    useEffect(() => {
        if (!canLoad) return;

        void refresh();

        return () => {
            controllerRef.current?.abort();
            requestRef.current++;
        };
    }, [canLoad, refresh]);

    const current =
        canLoad && state?.key === key ? state : null;

    return {
        initialized,
        canLoad,
        details: current?.details,
        activity: current?.activity,
        comments: current?.comments ?? [],
        detailsError: current?.detailsError,
        activityError: current?.activityError,
        commentsError: current?.commentsError,
        loading:
            canLoad &&
            !current?.details &&
            (!current || current.fetching),
        refreshing: Boolean(current?.fetching),
        commentsPage: current?.commentsPage ?? commentsPage,
        commentsTotalPages: current?.commentsTotalPages ?? 1,
        refresh,

        setCommentsPage(page: number) {
            setPagination({ key, page: Math.max(1, page) });
        }
    };
}