#!/usr/bin/env python3
'''
EnCAB: Energetic Calculator for Ancient Buildings

Required at least Python 3.6, MUST install modules (BeautifulSoup4, jinja2) with
> python -m pip -r requirements.txt
'''


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


def files_index(website_dir):
    """ Generate dict of file names from first subdirectories """

    # Get files index
    index = dict()
    for subdir in os.listdir(website_dir):
        if os.path.isdir(os.path.join(website_dir,subdir)):
            for filename in os.listdir(os.path.join(website_dir,subdir)):
                if os.path.isfile(os.path.join(website_dir,subdir,filename)) and filename.endswith('.html'):
                    if IGNORE_IF_CONTAIN and IGNORE_IF_CONTAIN in filename:
                        continue  # exclude index files themselves
                    # for each subdir make a list of filenames
                    # {'subdir1': ['file1','file2'], 'subdir2': ['file3'], ..}
                    index.setdefault(subdir, []).append(filename[:-5])  # append file without .html extension

    # Get author index
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
        for item in soup.find_all(attrs={'id': True}):
            if item['id']:
                author_index.add(item['id'])
    else:
        print(f'[Err] Bibliography file "{bibliography}" not found')

    return index, author_index


def get_algo_data(algo_dir, index, author_index):

    # Archive the data
    zip_name = 'EnCAB_input_' + datetime.date.today().strftime('%Y%m%d') + '.zip'
    zip_file = zipfile.ZipFile(os.path.join(algo_dir, 'archives', zip_name), mode='w', compression=zipfile.ZIP_DEFLATED)

    algo_data = []
    for file in os.listdir(algo_dir):
        filename = os.path.join(algo_dir, file)
        if os.path.isfile(filename) and filename.endswith(('.xml', '.txt')):
            algo_data += [(parse(filename, index, author_index), os.path.basename(filename))]
            zip_file.write(filename, arcname=os.path.basename(filename))

    zip_file.close()
    return algo_data


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

    for elem in root.iter():
        # Remove blank lines from all text
        if elem.text:
            elem.text = elem.text.strip()

    # Check text correctness
    def check_code(code, t_regex=None, mandatory=True):
        if root.find(code) is None or not root.find(code).text:
            if mandatory:
                errors.append(code)
            return
        if t_regex and not re.match(t_regex, root.find(code).text, flags=re.I):
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
                print(f'[Err] Author "{author_name}" in "{os.path.basename(filename)}" not found in bibliography')
        return

    errors = []

    # reference: authors_date_pagenumber(_sequential)
    check_code('reference', r"^\w+_\d{4}_\d+(|_\d+)$", mandatory=True)
    # biblioref/authorgroup/author/surname
    check_code('biblioref/authorgroup/author/surname', mandatory=True)
    # biblioref/authorgroup/author/*name: in Bibliography
    for author in root.find('biblioref/authorgroup'):
        check_biblio(author)
    # biblioref/abbrev: author_date
    check_code('biblioref/abbrev', r"^\w+_\d{4}[a-z]?$", mandatory=True)
    check_code('biblioref/abbrev2', r"^\w+_\d{4}[a-z]?$", mandatory=False)
    # biblioref/pagenums: numbers separated by - or ,
    check_code('biblioref/pagenums', r"^\d+( ?[-,] ?\d+)*$", mandatory=True)
    check_code('biblioref/pagenums2', r"^\d+( ?[-,] ?\d+)*$", mandatory=False)
    # algdata/algorithm_statement
    check_code('algdata/algorithm_statement', mandatory=True)
    # algauthors/*_author_group/author/*_date: dd.mm.yyyy
    # algauthors/*_author_group/author/*name: in Bibliography
    creation = 'algauthors/creation_author_group'
    modification = 'algauthors/modification_author_group'
    if root.find(creation) is not None and len(root.find(creation)) > 1:  # Check only 1 creation author
        print(f'[Err] Only 1 author allowed in {creation} in "{os.path.basename(filename)}"')
    check_code(creation+'/author/creation_date', r"^\d{2}\.\d{2}\.\d{4}$", mandatory=False)
    check_biblio(root.find(creation+'/author'))
    if root.find(modification) is not None:
        for i in range(len(root.find(modification))):
            check_code(modification+'/author['+str(i+1)+']/modification_date', r"^\d{2}\.\d{2}\.\d{4}$", mandatory=False)
            check_biblio(root.find(modification+'/author['+str(i+1)+']'))

    # algorithm_description: check if file exist for each description type
    for d_type in root.find('algorithm_description'):
        if d_type.tag not in index.keys():
            print('[Err] "{}" from "{}" not found in website folders.'.format(d_type.tag+'/', os.path.basename(filename)))
        else:
            if d_type.text and d_type.text.replace(' ','_').lower() not in index[d_type.tag]:
                # errors.append()
                print('[Err] "{}" from "{}" not found in website files.'
                      .format(d_type.tag+'/'+d_type.text.replace(' ','_'), os.path.basename(filename)))

    # Check operations
    op_result = False
    if root.find('algdata/results'):
        for var in root.find('algdata/results'):
            # Check <unit> in results
            if not var.find('unit').text:
                print(f'[Err] Missing <unit> in "{os.path.basename(filename)}"')
            else:
                unit = var.find('unit').text.lower()
                if unit not in index['units']:
                    print('[Err] "{}"  from "{}" not found in website files.'
                          .format('units/'+unit.replace(' ', '_'), os.path.basename(filename)))
            # Check <op> in results
            if not var.find('op').text:
                print(f'[Err] Missing <op> in <results> in "{os.path.basename(filename)}"')
            op_result = True
    if root.find('algdata/variables'):
        var_names = set()
        for var in root.find('algdata/variables'):
            # Check <unit> in variables
            if not var.find('unit').text:
                print(f'[Err] Missing <unit> in "{os.path.basename(filename)}"')
            else:
                unit = var.find('unit').text.lower()
                if unit not in index['units']:
                    print('[Err] "{}"  from "{}" not found in website files.'
                          .format('units/'+unit.replace(' ', '_'), os.path.basename(filename)))
            # Check <op> in variables
            if not op_result and (var.find('op') is None or not var.find('op').text):
                print(f'[Err] Missing <op> in "{os.path.basename(filename)}"')
            # Check different names
            if var.tag in var_names:
                print(f'[Err] Same names of variables in "{os.path.basename(filename)}"')
            else:
                var_names.add(var.tag)

    if errors:
        print(f'[Err] In "{os.path.basename(filename)}", the data in following tags is wrong: {errors}')

    return root


def write_data(website_dir, algo_data, index):
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
                        blocks_data = sorted(algo_data, key=lambda x:
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

    return env.get_template(filename).render(blocks_data=blocks_data, sort=sort)


def check_config():
    """ Base check to assert existence of files and directories """

    missing = []
    for conf in ['WEBSITE_DIR', 'ALGORITHMS_DIR', 'TEMPLATE_ALGORITHM', 'TEMPLATE_INDEX']:
        if not conf in globals():
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
    algo_data = get_algo_data(os.path.relpath(ALGORITHMS_DIR), index, author_index)

    print('[*] Writing data...')
    write_data(os.path.relpath(WEBSITE_DIR), algo_data, index)

    print('\n[+] Done!')

    input()
    sys.exit()
