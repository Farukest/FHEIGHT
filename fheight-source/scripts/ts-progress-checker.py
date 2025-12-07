#!/usr/bin/env python3
import os
import subprocess

tracked_exts = ['js', 'coffee', 'ts']

def get_tracked_files() -> list[str]:
    '''
    Tracked files are any files in the Git repository with a tracked file extension.
    Raises CalledProcessError if return code is nonzero.
    '''
    cmd = ['git', 'ls-files']
    files = subprocess.run(cmd, capture_output=True, text=True, check=True).stdout.splitlines()
    return [f for f in files if '.' in f and f.split('.')[-1] in tracked_exts]

def sum_contents(files: list[str]) -> dict[str, int]:
    '''
    Aggregates the file sizes of the given files by type.
    Raises OSError if the file is inaccessible.
    '''
    sums = dict()
    for f in files:
        ext = f.split('.')[-1]
        if ext not in sums: sums[ext] = 0
        sums[ext] += os.path.getsize(f)
    return sums

def main():
    '''
    Computes the percentage weight of each tracked file extension in the repo.
    '''
    try:
        files = get_tracked_files()
    except Exception as e:
        print('Failed to get files in Git repository:', str(e))
        exit(1)

    try:
        sums = sum_contents(files)
    except Exception as e:
        print('Failed to compute file sizes:', str(e))
        exit(1)

    total = sum(sums.values())
    for ext in tracked_exts:
        pct = sums[ext] / total * 100
        print(f'Extension {ext} constitutes {pct:.2f}% of total')

if __name__ == '__main__':
    main()
