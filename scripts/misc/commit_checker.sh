#!/bin/bash -e
#
# Copyright (C) 2020 HERE Europe B.V.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0
# License-Filename: LICENSE
#

# This is script for verifying commit message by requirements.
# Best git and linux practices are included.
# Requirements can be find in scripts/misc/commit_message_recom.txt

# Saving whole commit message into file for reading below
echo "`git log --pretty=format:'%B' -2 | sed '1d' | sed '1d' `" >> commit.log

# Counting number of lines in file
num_lines=`wc -l commit.log| cut -d'c' -f1` 

# Loop for every line in file
for (( line=1; line<=${num_lines}; line++ ))
do
    current_line_len=`cat commit.log| sed -n ${line}p |wc -m | sed 's/\ \ \ \ \ \ /''/g' `
    if [ $line -eq 1 ] && [ ${current_line_len} -gt 50 ] ; then
        echo ""
        echo "ERROR: Title is ${current_line_len} length, so it's too long for title. Expect less than 50 chars !"
        echo ""
        echo "Please read following rules:"
        cat scripts/misc/commit_message_recom.txt
        exit 1
    fi
    if [ $line -eq 2 ] && [ ${current_line_len} -ne 1 ] ; then
        echo ""
        echo "ERROR: Second line in Commit Message is not zero length !"
        echo ""
        echo "Please read following rules:"
        cat scripts/misc/commit_message_recom.txt
        exit 1
    fi
    if [ $line -eq 3 ] && [ ${current_line_len} -lt 1 ] && [ -n $(cat commit.log| sed -n ${line}p | grep 'See also: ') ] && [ -n $(cat commit.log| sed -n ${line}p | grep 'Relates-To: ') ] && [ -n $(echo ${current_line_len}| grep 'Resolves: ') ] ; then
        echo ""
        echo "ERROR: No details added to commit message besides title !"
        echo ""
        echo "Please read following rules:"
        cat scripts/misc/commit_message_recom.txt
        exit 1
    fi
    if [ ${current_line_len} -gt 72 ] ; then
        echo ""
        echo "ERROR: ${current_line_len} chars in ${line}-th line is too long. Any line length must be less than 72 chars !"
        echo ""
        echo "Please read following rules:"
        cat scripts/misc/commit_message_recom.txt
        exit 1
    fi
    echo " ${line}-th line is ${current_line_len} chars length . OK."
done

# $here_user_commit is not zero when @here.com found in commit message.
here_user_commit=$(cat commit.log | grep '@here.com') || true

if [[ -n ${here_user_commit}  ]] ; then
    echo ""
    echo "Commit message contains here user sign-off with here email. OK."
    echo "Ticket reference is mandatory!"
    echo ""

    relates_to=$(cat commit.log | grep 'Relates-To: ') || true
    resolves=$(cat commit.log | grep 'Resolves: ') || true
    see=$(cat commit.log | grep 'See also: ') || true

    echo "Reference like:  ${relates_to} ${resolves} ${see}  was found in commit message. OK."

    if [[ -n ${relates_to} || -n ${resolves} || -n ${see} ]] ; then
        echo ""
        echo "Commit message contains issue reference. OK."
        echo ""
    else
        echo ""
        echo "ERROR: Commit message does not contain ticket or issue reference like Relates-To: or Resolves: or See also:  !"
        echo ""
        echo "Please read following rules:"
        cat scripts/misc/commit_message_recom.txt
        exit 1
    fi
else
    echo ""
    echo "Commit message contains external user sign-off with external email. OK."
    echo "Ticket reference is optional."
    echo ""
    exit 0
fi