#!/usr/bin/env python3
import hashlib
import os
import subprocess
from typing import List

def get_files(path: str) -> List[str]:
    return [os.path.join(p, f) for (p, dirs, fs) in os.walk(path) for f in fs]

def replace_file_with_symlink(keep_path: str, link_path: str) -> None:
    try:
        # prevent git rm from automatically deleting empty directories
        touch_file = os.path.dirname(link_path) + '/.keep'
        subprocess.run(['touch', touch_file])

        # purge the duplicate file
        subprocess.run(['git', 'rm', link_path]).check_returncode()

        # link to the kept file
        rel_path = os.path.relpath(keep_path, os.path.dirname(link_path))
        os.symlink(rel_path, link_path)

        # delete the temporary .keep file
        os.remove(touch_file)
    except:
        print(f'failed to link file {link_path} to {keep_path}')
        exit(1)

if __name__ == '__main__':
    checksums = dict()
    size = 0
    resources_dir = 'app/resources'
    original_resources_dir = 'app/original_resources'
    for d in [resources_dir, original_resources_dir]:
        for file in get_files(d):
            with open(file, 'rb') as f:
                contents = f.read()
                csum = hashlib.sha256(contents).hexdigest()
            if csum in checksums:
                print(f'file {file} duplicates {checksums[csum]}')
                replace_file_with_symlink(checksums[csum], file)
                size += len(contents)
            else:
                checksums[csum] = file
    print(f'total deduplicated file size: {size} bytes')
