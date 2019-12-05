#!/usr/bin/env python3
#
# EnCAB: Energetic Calculator for Ancient Buildings
#
# Required at least Python 3.6 with modules "BeautifulSoup4" and "jinja2"
# Install modules: python -m pip -r requirements.txt
# Usage: ./EnCAB.py
#


import sys
import os  # files
import re  # regex
import datetime
import xml.etree.ElementTree as ET  # XML file reading
from bs4 import BeautifulSoup  # HTML tag parsing
import jinja2  # HTML template
import zipfile
# from pyuca import Collator  # UTF sorting

from config import *  # File "config.py" stores program settings


# move to program directory for relative links
__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
os.chdir(__location__)


class Logger(object):
    def __init__(self):
        self.terminal = sys.stdout
        self.log = open('log.txt', 'w', encoding="utf-8")

    def write(self, message):
        self.terminal.write(message)
        self.log.write(message)

    def flush(self):
        pass


# Save text to log.txt
logger = Logger()
sys.stdout = logger
sys.stderr = logger


def check_config():
    """ Base check to assert existence of files and directories """

    missing = []
    for conf in ['WEBSITE_DIR', 'ALGORITHMS_DIR', 'TEMPLATE_ALGORITHM', 'TEMPLATE_INDEX']:
        if conf not in globals():
            missing.append(conf)
    if missing:
        print('[Err] Wrong config, {} not found.'.format(str(missing).strip('[]').replace('\'', '\"')))
        sys.exit()

    for config_dir in [WEBSITE_DIR, ALGORITHMS_DIR]:
        if not os.path.isdir(os.path.relpath(config_dir)):
            print(f'[Err] Wrong config, "{config_dir}" directory not found.')
            sys.exit()
    for config_file in [TEMPLATE_ALGORITHM, TEMPLATE_INDEX]:
        if not os.path.isfile(os.path.relpath(config_file)):
            print(f'[Err] Wrong config, file "{config_file}" not found.')
            sys.exit()

    return


def files_index(website_dir):
    """ Generate dict of file names from first subdirectories """

    # Get files index
    index = dict()
    for subdir in os.listdir(website_dir):
        if os.path.isdir(os.path.join(website_dir, subdir)):
            for filename in os.listdir(os.path.join(website_dir, subdir)):
                if os.path.isfile(os.path.join(website_dir, subdir, filename)) and filename.endswith('.html'):
                    if IGNORE_IF_CONTAIN and IGNORE_IF_CONTAIN in filename:
                        continue  # exclude index files themselves
                    # for each subdir make a list of filenames
                    # {'subdir1': ['file1','file2'], 'subdir2': ['file3'], ..}
                    index.setdefault(subdir, []).append(filename[:-5])  # append filename without .html extension

    # Get authors index
    author_index = set()
    bibliography = os.path.join(WEBSITE_DIR, "bibliography/bibliography.html")
    if os.path.isfile(bibliography):
        try:
            soup = BeautifulSoup(open(bibliography, 'r', encoding="utf-8"), "html.parser")
        except IOError as err1:
            print(f'[Err] {str(err1)}')
            sys.exit()

        for item in soup.find_all('a', attrs={'name': True}):
            if item['name']:
                author_index.add(item['name'])
        for item in soup.find_all('a', attrs={'id': True}):
            if item['id']:
                author_index.add(item['id'])
    else:
        print(f'[Err] Bibliography file "{bibliography}" not found')

    return index, author_index


def get_alg_data(alg_dir, index, author_index):
    """ Get algorithms data from the XML files and archive a copy of it """

    # Prepare archive for the data
    zip_name = 'EnCAB_input_' + datetime.datetime.now().strftime('%Y%m%d-%H%M%S') + '.zip'
    zip_file = zipfile.ZipFile(os.path.join(alg_dir, 'archives', zip_name), mode='w', compression=zipfile.ZIP_DEFLATED)
    
    # Get the data
    alg_data = []
    for file in os.listdir(alg_dir):
        filename = os.path.join(alg_dir, file)
        if os.path.isfile(filename) and filename.endswith(('.xml', '.txt')):
            zip_file.write(filename, arcname=os.path.basename(filename))
            alg_data += [(parse(filename, index, author_index), os.path.basename(filename))]

    zip_file.close()
    return alg_data


def parse(filename, index, author_index):
    """ Read XML algorithms data and check for errors """

    try:
        tree = ET.parse(filename)
    except ET.ParseError as err:
        print(f'[Err] "{os.path.basename(filename)}" {err}.')
        sys.exit()
    except IOError as err1:
        print(f'[Err] {str(err1)}')
        sys.exit()
    except UnicodeError as err2:
        print(f'[Err] Check for bad characters (encoding: UTF-8) in "{os.path.basename(filename)}"')
        print(f'\n- Full error: \n{str(err2)}')
        sys.exit()

    root = tree.getroot()

    # Remove blank lines from all text
    for elem in root.iter():
        if elem.text:
            elem.text = elem.text.strip()

    # Check text correctness
    def check_code(code, test_regex=None, mandatory=True):
        if mandatory and not root.findtext(code):
            errors.append(code)
            return
        if test_regex and not re.match(test_regex, root.findtext(code), flags=re.I):
            errors.append(code)
        return

    def check_biblio(author):
        if author_index:
            author_name = ''
            if author.find('surname') is not None:
                author_name += (author.find('surname').text or '').strip(',.').replace(' ', '')
            if author.find('firstname') is not None:
                author_name += (author.find('firstname').text or '').strip(',.').replace(' ', '')
            if author_name and author_name not in author_index:
                print(f'[Err] In "{os.path.basename(filename)}", author "{author_name}" not found in bibliography.')
        return

    errors = []

    # reference: authors_date_pagenumber(_sequentialnumber)
    check_code('reference', r"^\w+_\d{4}_\d+(|_\d+)$", mandatory=True)
    
    # biblioref/author/*name: in Bibliography
    for i, author in enumerate(root.findall('biblioref/author'), start=1):
        check_code(f'biblioref/author[{i}]/surname', mandatory=True)
        check_biblio(author)
        
        # biblioref/author/abbrev: author_date
        check_code(f'biblioref/author[{i}]/abbrev', r"^\w+_\d{4}$", mandatory=True)
        
        # biblioref/author/pagenums: numbers separated by - or ,
        check_code(f'biblioref/author[{i}]/pagenums', r"^\d+(-\d+)?(, ?\d+(-\d+)?)*$", mandatory=True)

    # algorithm_description: check if file exist for each description type
    for d_type in root.find('algorithm_description'):
        if d_type.tag not in index.keys():
            print(f'[Err] In "{os.path.basename(filename)}", algorithm description "{d_type.tag}" not found in website directories.')
        else:
            if d_type.text:
                txt = d_type.text.replace(' ', '_').lower()
                if txt not in index[d_type.tag]:
                    print(f'[Err] In "{os.path.basename(filename)}", {d_type.tag} "{txt}" not found in website files.')

    # algdata/algorithm_statement
    check_code('algdata/algorithm_statement', mandatory=True)

    # Check operations
    var_names = set()
    op_in_results = False
    for algdata in ['results', 'variables']:
        if root.find('algdata/' + algdata):
            for var in root.find('algdata/' + algdata):
                # algdata/{algdata}/*/unit
                check_code(f'algdata/{algdata}/{var.tag}/unit', mandatory=True)
                if var.findtext('unit'):
                    unit = var.findtext('unit').replace(' ', '_').lower()
                    if unit not in index['units']:
                        print('[Err] In "{os.path.basename(filename)}", unit "{unit}" not found in website files.')
                # algdata/{algdata}/*/op
                if algdata == 'results' or not op_in_results:
                    check_code(f'algdata/{algdata}/{var.tag}/op', mandatory=True)
                    op_in_results = True
                # algdata/{algdata}/* different names
                if var.tag in var_names:
                    print(f'[Err] In "{os.path.basename(filename)}", more than one <{var.tag}> in <algdata>.')
                else:
                    var_names.add(var.tag)
    
    # algauthors/author_creation: only 1 allowed
    if root.find('algauthors/author_creation') is not None and len(root.findall('algauthors/author_creation')) > 1:
        print(f'[Err] In "{os.path.basename(filename)}", only 1 author_creation allowed in {creation}.')
    # algauthors/author_*/*name: in Bibliography
    check_biblio(root.find('algauthors/author_creation'))
    # algauthors/author_*/date: dd.mm.yyyy
    check_code(f'algauthor/author_creation/date', r"^\d{1,2}\.\d{1,2}\.\d{4}$")
    # same for algauthors/author_modification
    for i, algauthor_m in enumerate(root.findall('algauthors/author_modification'), start=1):
        check_biblio(algauthor_m)
        check_code(f'algauthor/{algauthor_m}[{i}]/date', r"^\d{1,2}\.\d{1,2}\.\d{4}$")
    
    # Print errors
    if errors:
        print(f'[Err] In "{os.path.basename(filename)}", data in following tags is wrong or missing: {errors}')

    return root


def write_data(website_dir, alg_data, index):
    """ Update <section>s with HTML rendered data """

    # Regex parser for <section> tags [html parsers don't keep formatting]
    regex_section = re.compile(r"((.*?)(<section.*?>).*?(<\/section>.*?(?=(?:<section|$))))", flags=re.DOTALL|re.I)

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
                    print(f'[Err] {str(err1)}')
                    sys.exit()

                # search for <section>s
                sections = regex_section.findall(html_file)
                if not sections:
                    continue

                html_file_updated = ''

                for unchanged, start, section, end in sections:

                    # check attributes
                    soup = BeautifulSoup(section, "html.parser").find('section')
                    sort = soup.get('sort')
                    if not soup.has_attr('block'):
                        print(f'[Err] Missing attribute block in <section> in "{os.path.basename(filename)}".')
                        html_file_updated += unchanged
                        continue
                    elif not sort:
                        print(f'[Err] Missing attribute sort in <section> in file "{os.path.basename(filename)}".')
                        html_file_updated += unchanged
                        continue

                    # Based on block and sort, choose template and sort/trim the data
                    if soup['block'] == "algorithm":
                        template = TEMPLATE_ALGORITHM
                        sort = SORT_STRINGS[sort] if sort in SORT_STRINGS.keys() else sort
                        blocks_data = sorted(alg_data, key=lambda x:
                                (x[0].find(sort).text if x[0].find(sort) is not None and x[0].find(sort).text else 'zzz',
                                 x[0].find('reference').text))

                    elif soup['block'] == "index":
                        template = TEMPLATE_INDEX
                        if sort in index.keys():
                            blocks_data = sorted(index[sort])
                        else:
                            print(f'[Err] Attribute sort="{sort}" in <section> in file "{os.path.basename(filename)}" NOT valid.')
                            html_file_updated += unchanged
                            continue

                    else:
                        block = soup['block']
                        print(f'[Err] Attribute block="{block}" in <section> in file "{os.path.basename(filename)}" NOT valid.')
                        html_file_updated += unchanged
                        continue

                    html_data = generate_html(os.path.relpath(template), blocks_data, sort)

                    # reconstruct html with updated <section>
                    html_file_updated += start + section + html_data + end

                # write HTML to file
                try:
                    with open(filename, 'w', encoding='utf-8') as html:
                        html.write(html_file_updated)

                except IOError as err1:
                    input('\n[-] {}\n'.format(str(err1)))
                    sys.exit()

    return


def generate_html(template, blocks_data, sort):
    """ Sort and render the data with templates """

    path, filename = os.path.split(template)
    env = jinja2.Environment(loader=jinja2.FileSystemLoader(path or '.'))

    def capfirst(text):
        return ' '.join(s[:1].upper() + s[1:] for s in text.split(' '))
    env.filters['capfirst'] = capfirst

    time_now = round(datetime.datetime.now().timestamp() * 1000)

    return env.get_template(filename).render(blocks_data=blocks_data, sort=sort, time_now=time_now)


if __name__ == '__main__':
    
    check_config()
    
    print(f'''
 EnCAB: Energetic Calculator for Ancient Buildings
------------------------------------------------------

 This program will update website <section> with indexes and algorithms.
 Edit config file to change directories and preference.

 Config file: "{'config.py'}".
 Website directory: "{WEBSITE_DIR}".
 Algorithms directory: "{ALGORITHMS_DIR}".
 Algorithm template: "{TEMPLATE_ALGORITHM}".
 Index template: "{TEMPLATE_INDEX}".

''')

    try:
        input('Press ENTER to Continue, Ctrl-C to Abort.\n')
    except KeyboardInterrupt:  # do not send error for Ctrl-C
        sys.exit()

    print('[*] Generating indexes...')
    index, author_index = files_index(os.path.relpath(WEBSITE_DIR))

    print('[*] Importing algorithms data...')
    alg_data = get_alg_data(os.path.relpath(ALGORITHMS_DIR), index, author_index)

    print('[*] Writing data...')
    write_data(os.path.relpath(WEBSITE_DIR), alg_data, index)

    print('\n[+] Done!')

    input()
    sys.exit()
