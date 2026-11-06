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
  # The snippet switches itself off for anything starting with two underscores,
  # so it can sit in the source with __ACCESS_KEY__ in place and do nothing. A
  # code of that shape would be accepted everywhere and silently publish the
  # page wide open, with a green run to go with it.
  __*) echo "gate: a code may not start with two underscores, that shape switches the gate off" >&2; exit 1 ;;
esac
if ! grep -q "__ACCESS_KEY__" "$file"; then
  echo "gate: $file carries no placeholder, nothing to arm" >&2
  exit 1
fi
sed -i "s/__ACCESS_KEY__/$key/g" "$file"

# The gate also ships as a pair of separate files, zugang.js and zugang.css, for
# a page whose own rules forbid inline code. Those carry the placeholder too and
# are armed the same way, but they have no head to put a robots line in, so the
# rest of this script only applies to HTML.
case "$file" in
  *.html|*.htm) ;;
  *) echo "gate: armed in $file"; exit 0 ;;
esac

# Search engines are the one thing the gate really has to keep out, and the gate
# runs in the browser. A crawler that does not run scripts sees the whole page
# and no instruction at all. So the instruction is written into the file itself,
# at publishing time, where it holds without scripting.
if ! grep -qi '<meta name="robots"' "$file"; then
  # After the charset line when there is one: that declaration has to stand in
  # the first bytes of the document and nothing may push it down.
  if grep -q '<meta charset=' "$file"; then
    sed -i '0,/<meta charset=[^>]*>/s|<meta charset=[^>]*>|&\n<meta name="robots" content="noindex,nofollow">|' "$file"
  else
    sed -i '0,/<head>/s|<head>|<head>\n<meta name="robots" content="noindex,nofollow">|' "$file"
  fi
fi
if ! grep -qi '<meta name="robots"' "$file"; then
  echo "gate: $file has no <head>, the noindex line could not be placed" >&2
  exit 1
fi
echo "gate: armed in $file"
