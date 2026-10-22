import { writeFileSync } from "node:fs";
import path from "node:path";
import { OUT, ROOT, liveFiles, renderLiveMap } from "./live-map";

writeFileSync(path.join(ROOT, OUT), renderLiveMap());
console.log(`live map: ${liveFiles().length} files → ${OUT}`);
