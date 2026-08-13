import sharp from "sharp";
import { readdir, mkdir } from "fs/promises";
import path from "path";

const SOURCE_DIR = "./public/images";
const OUTPUT_DIR = "./public/images/trimmed";

async function trimAll() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const files = (await readdir(SOURCE_DIR)).filter((f) => f.endsWith(".png"));

  for (const file of files) {
    const inputPath = path.join(SOURCE_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, file);

    await sharp(inputPath)
      .trim({ threshold: 10 }) // strips transparent/near-uniform padding automatically
      .toFile(outputPath);

    console.log(`Trimmed: ${file}`);
  }
}

trimAll();
