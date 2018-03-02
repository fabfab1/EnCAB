#!/usr/bin/env python3
'''
EnCAB: Energetic Calculator for Ancient Architecture
'''

import sys
import os   # files
import re   # regex
import xml.etree.ElementTree as ET  # XML file reading
from bs4 import BeautifulSoup  # HTML tag parsing
import jinja2   # HTML template
# from pyuca import Collator			# UTF sorting

from config import *  # File "config.py" stores program settings


# move to program directory for relative links
__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
os.chdir(__location__)


def files_index(website_dir):
    """ Generate dict of file names from first subdirectories """

    # TODO: move to single folder or get list from config

    index = dict()

    for subdir in os.listdir(website_dir):
        if os.path.isdir(os.path.join(website_dir,subdir)):
            for filename in os.listdir(os.path.join(website_dir,subdir)):
                if os.path.isfile(os.path.join(website_dir,subdir,filename)) and filename.endswith('.html'):
                    if '_index' not in filename:  # exclude index files
                        # for each subdir make a list of filenames
                        # {'subdir1': ['file1','file2'], 'subdir2': ['file3'], ..}
                        index.setdefault(subdir, []).append(filename[:-5])  # append file without .html extension

    return index


def get_algo_data(algo_dir, index):

    algo_data = []
    for file in os.listdir(algo_dir):
        filename = os.path.join(algo_dir, file)
        if os.path.isfile(filename) and filename.endswith(('.xml', '.txt')):
            algo_data += [(parse(filename, index), os.path.basename(filename))]

    return algo_data


def parse(filename, index):
    """ Read XML algorithms data and check for errors """

    errors = []  # list of all errors encountered

    tree = ET.parse(filename)
    """
    except IOError as err1:
        input('\n[-] {}\n'.format(str(err1)))
        sys.exit()
    except UnicodeError:
       input('\n[Err] "{0}".\n --> Check for bad characters or convert file encoding to UTF-8.\n'.format(filename))
       sys.exit()
    """

    root = tree.getroot()
    # (.attrib), .text, .tag, .find('item'), .findall
    # for atype in e.findall('type'):
    #     print(atype.get('foobar'))

    # Check if all the tags are know
    for elem in root.iter():
        if elem.tag not in KNOWN_TAGS:
            pass  # print('[-] Unknown input: "{}"'.format(elem.tag))

    # reference: authors_date_pagenumber_sequential
    if not re.match(r"^\w+_\d{4}_\d+_\d+$", root.find('reference').text, flags=re.I):
        errors.append('reference')
    # ecc: ...
    if not True:
        errors.append('ecc...')


    # algorithm_description: check if file exist for each description type
    # ! CHANGE with config or sub-folder
    for d_type in root.find('algorithm_description'):
        if d_type.tag not in index.keys():
            print('[Err] "{}" from "{}" not found in website folders.'.format(d_type.tag+'/', os.path.basename(filename)))
        else:
            if d_type.text and d_type.text.replace(' ','_').lower() not in index[d_type.tag]:
                # errors.append()
                print('[Err] "{}" from "{}" not found in website files.'.format(d_type.tag+'/'+d_type.text.replace(' ','_'), os.path.basename(filename)))
    # TODO: all errors trap (check codes and info) [NOT everything must be present]

    if errors:
        print('[Err] Errors found in "{}", following values are wrong: {}'.format(filename, errors))

    # ? beautify XML files

    return root


def write_data(website_dir, algo_data, index):
    """ Update <section>s with HTML rendered data """

    # Regex parser for <section> tags [html parsers don't keep formatting]
    regex_section = re.compile(r"(.*?)((<section.*?>).*?(<\/section>))(.*)", flags=re.DOTALL|re.I)

    # Search each HTML file
    for root, dirs, files in os.walk(website_dir):
        for file in files:
            if file.endswith(('.html','.htm')):

                filename = os.path.join(root, file)
                # open file
                try:
                    with open(filename, 'r', encoding='utf-8') as html:
                        html_file = html.read()

                except IOError as err1:
                    input('\n[-] {}\n'.format(str(err1)))
                    sys.exit()

                # search for <section>
                sections = regex_section.fullmatch(html_file)
                if not sections:
                    continue

                # check attributes
                soup = BeautifulSoup(sections.group(2), "html.parser").find('section')
                if not soup.has_attr('block'):
                    print('[Err] Found <section> without "block" attribute in "{}".'.format(filename))
                    continue

                sort = soup.get('sort')

                # Based on block and sort, choose template and sort/trim the data
                if soup['block'] == "algorithm":  # ? use file names / if type in TEMPLATES

                    template = TEMPLATE_ALGORITHM

                    if sort in SORT_STRINGS.keys():
                        blocks_data = sorted(algo_data, key=lambda x: x[0].find(SORT_STRINGS[sort]).text
                                             if x[0].find(SORT_STRINGS[sort]) is not None else 'zzz')
                    # elif sort:  # TODO: custom sort
                    else:
                        blocks_data = algo_data[:]  # just copy the data if no sort found for algorithm

                elif soup['block'] == "index":

                    template = TEMPLATE_INDEX

                    if not sort:
                        print('[Err] Missing sort attribute in <section> for index in file "{}".'.format(filename))
                        continue
                    if sort in index.keys():

                        blocks_data = sorted(index[sort])

                    else:
                        print('[Err] Sort attribute in file "{}" NOT valid.'.format(filename))
                        continue

                else:
                    print('[Err] <section> block value "{}" in file "{}" NOT valid.'.format(block, filename))
                    continue

                html_data = generate_html(os.path.relpath(template), blocks_data)

                # reconstruct html with updated <section>
                html_file_updated = sections.group(1)+sections.group(3)+ html_data +\
                                    sections.group(4)+sections.group(5)

                # write HTML to file
                try:
                    with open(filename, 'w', encoding='utf-8') as html:
                        html.write(html_file_updated)

                except IOError as err1:
                    input('\n[-] {}\n'.format(str(err1)))
                    sys.exit()

    return


def generate_html(template, blocks_data):
    """ Sort and render the data with templates """

    path, filename = os.path.split(template)
    return jinja2.Environment(loader=jinja2.FileSystemLoader(path or '.'))\
        .get_template(filename).render(blocks_data=blocks_data)


def perror(text):
    """ Print the error and write it to log """

    print(text)  # TODO

    return


def check_config():
    """ Base check to assert existence of files and directories """

    missing = []
    for conf in ['WEBSITE_DIR', 'ALGORITHMS_DIR', 'TEMPLATE_ALGORITHM', 'TEMPLATE_INDEX']:
        if not conf in globals():
            missing.append(conf)
    if missing:
        input('[Err] Wrong config, {} not found.'.format(str(missing).strip('[]').replace('\'', '\"')))
        sys.exit()

    for config_dir in [WEBSITE_DIR, ALGORITHMS_DIR]:
        if not os.path.isdir(os.path.relpath(config_dir)):
            input('[Err] Wrong config, "{}" directory not found.'.format(config_dir))
            sys.exit()

    for config_template in [TEMPLATE_ALGORITHM, TEMPLATE_INDEX]:
        if not os.path.isfile(os.path.relpath(config_template)):
            print('[Err] Wrong config, template "{}" not found.'.format(config_template))

    return


if __name__ == '__main__':
    # app.run()
    check_config()

    print('''
 EnCAB: Energetic Calculator for Ancient Architecture
------------------------------------------------------

 This program will update website <section> with indexes and algorithms.
 Edit config file to change directories and preference.

 Config file: "{}".
 Website directory: "{}".
 Algorithms directory: "{}".
 Algorithm template: "{}".
 Index template: "{}".

'''.format('config.py', WEBSITE_DIR, ALGORITHMS_DIR, TEMPLATE_ALGORITHM, TEMPLATE_INDEX))

    try:
        print('Press ENTER to Continue, Ctrl-C to Abort.\n')  # input()
    except KeyboardInterrupt:  # Do not send error for Ctrl-C
        sys.exit()

    print('[*] Generating indexes...')
    index = files_index(os.path.relpath(WEBSITE_DIR))

    print('[*] Importing algorithms data...')
    algo_data = get_algo_data(os.path.relpath(ALGORITHMS_DIR), index)

    # print(index)  ###

    print('[*] Writing data...')
    write_data(os.path.relpath(WEBSITE_DIR), algo_data, index)

    print('\n[+] Done!')

    # input()
    sys.exit()
