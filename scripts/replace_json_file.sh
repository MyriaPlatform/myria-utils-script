#!/bin/bash
set -euo pipefail

# Variables from pipeline
new_file_path=$1
original_file_path=$2

# Create a temp file
tmp=$(mktemp)

# Overwrite the file
echo "Replacing $original_file_path with $new_file_path"
cp -f $new_file_path $original_file_path
