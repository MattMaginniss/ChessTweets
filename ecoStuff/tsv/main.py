import csv
import sys

# This is pulling the TSV from https://github.com/niklasf/chess-openings and formatting them in a way chess-tools can use to calculate openings. 

def compileECO():
    tsv_fileA = open("a.tsv")
    tsv_fileB = open("b.tsv")
    tsv_fileC = open("c.tsv")
    tsv_fileD = open("d.tsv")
    tsv_fileE = open("e.tsv")
    files = [tsv_fileA, tsv_fileB, tsv_fileC, tsv_fileD, tsv_fileE]

    with open('../eco.pgn', 'w') as f:
        sys.stdout = f # Change the standard output to the file we created.
        for file in files:
            read_tsv = csv.reader(file, delimiter="\t")
            next(read_tsv)
            for row in read_tsv:
                print("[ECO \"" + row[0] + "\"]")
                print("[Opening \"" + row[1].split(':')[0] + "\"]")
                if len(row[1].split(':')) == 2:
                    print("[Variation \"" + row[1].split(':')[1].strip() + "\"]")
                print("")
                print(row[2] + " *")
                print("")


if __name__ == '__main__':
    compileECO()

