#!/bin/bash
script_path="$(realpath "$0")"

script_dir="$(dirname "$script_path")"
destination_dir="$script_dir/release/packages"

echo "script_dir: $script_dir"
echo "destination_dir: $destination_dir"

# npm install sharp
# cd release/app
# npm install --cpu=x64 --os=darwin sharp
# npm install --cpu=arm --os=darwin sharp
# npm install --cpu=x64 --os=win32 sharp
# npm install --cpu=x64 --os=linux sharp

npm run package:mac
files=$(find release/build -type f -name "PixelAfterAll-*.dmg")
echo $files
for file in $files; do
    mv "$file" "$destination_dir"
done
release/packages

npm run package:win
mv "$(find release/build -type f -name "PixelAfterAll *.exe")" "$destination_dir"

sed -i '' 's/"asar": true/"asar": false/' "$script_dir/package.json"
npm run package:lin
files=$(find release/build -type f -name "PixelAfterAll-*.AppImage")
for file in $files; do
    mv "$file" "$destination_dir"
done
sed -i '' 's/"asar": false/"asar": true/' "$script_dir/package.json"
