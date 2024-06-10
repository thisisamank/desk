from pathlib import Path
from typing import List


class FileController:
    
    def get_all_files(self, root: str) -> List[Path]:
        path = Path(root)
        files = self._list_all_files(path)
        return files

    def _list_all_files(self, path: Path) -> List[Path]:
        files: List[Path] = []
        for item in path.iterdir():
            if item.is_dir() and str(item).__contains__('.'):
                continue
            if item.is_file():
                files.append(item)
            else:
                files.extend(self._list_all_files(item))
        return files
    