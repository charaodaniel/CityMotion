import { fileURLToPath } from "url";
import path from "path";
function esmDirname(metaUrl) {
  return path.dirname(fileURLToPath(metaUrl));
}
export {
  esmDirname
};
