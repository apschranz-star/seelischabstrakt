#!/bin/sh
# Arms the access gate in one HTML file by writing the code into it.
#
#   gate/inject.sh <file.html> <code>
#
# The file carries the snippet from gate.snippet.html with the placeholder
# __ACCESS_KEY__. With an empty code the placeholder stays and the gate does
# nothing, so the page is public. The code may only contain A-Z a-z 0-9 _ -.
set -e
file="$1"
key="$2"
if [ ! -f "$file" ]; then
  echo "gate: no such file $file" >&2
  exit 1
fi
if [ -z "$key" ]; then
  echo "gate: no code given, $file stays public"
  exit 0
fi
case "$key" in
  *[!A-Za-z0-9_-]*) echo "gate: the code may only contain A-Z a-z 0-9 _ -" >&2; exit 1 ;;
esac
if ! grep -q "__ACCESS_KEY__" "$file"; then
  echo "gate: $file carries no placeholder, nothing to arm" >&2
  exit 1
fi
sed -i "s/__ACCESS_KEY__/$key/g" "$file"
echo "gate: armed in $file"
