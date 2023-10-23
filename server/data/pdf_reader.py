import os
import pandas as pd
from tabula import read_pdf

filename = "Licensed Pet Shop List.pdf"
dfs = read_pdf(filename, pages='all',
               pandas_options={'header': None})

for page in range(len(dfs)):
    dfs[page][7] = dfs[page][7].apply(lambda x: int(
        x) if pd.notnull(x) and type(x) == float else x)
    dfs[page][7] = dfs[page][7].apply(lambda x: str(x).replace(
        '.0', '') if pd.notnull(x) and type(x) == float else x)
    if page == 0:
        dfs[page] = pd.concat(
            [
                dfs[page].drop(dfs[page].columns[2:11], axis=1),
                dfs[page].apply(lambda row: ', '.join([str(val)
                                                       for val in row[2:8] if str(val) != 'nan']), axis=1)
            ], axis=1)

        dfs[page] = dfs[page].drop(row for row in range(0, 3))
    else:
        dfs[page] = pd.concat(
            [
                dfs[page].drop(dfs[page].columns[2:14], axis=1),
                dfs[page].apply(lambda row: ', '.join([str(val)
                                                       for val in row[2:8] if str(val) != 'nan']), axis=1)
            ], axis=1)
        dfs[page] = dfs[page].drop(row for row in range(0, 2))

    dfs[page].columns = ['License Number', 'Pet Shop Name', 'Address']

big_df = pd.concat(dfs, axis=0, ignore_index=True)
big_df.to_csv('big_df.csv', index=False)
