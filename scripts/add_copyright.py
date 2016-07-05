# borrowed from http://stackoverflow.com/questions/151677/tool-for-adding-license-headers-to-source-files

# updates the copyright information for all .cs files
# usage: call recursive_traversal, with the following parameters
# parent directory, old copyright text content, new copyright text content

import os

excludedir = ["../.sass-cache", "../.tmp", "../node_modules", "../assets/bower_components"]

def update_source(filename, oldcopyright, copyright):
    utfstr = chr(0xef)+chr(0xbb)+chr(0xbf)
    fdata = file(filename,"r+").read()
    isUTF = False
    if (fdata.startswith(utfstr)):
        isUTF = True
        fdata = fdata[3:]
    if (oldcopyright != None):
        if (fdata.startswith(oldcopyright)):
            fdata = fdata[len(oldcopyright):]
    if not (fdata.startswith(copyright)):
        print "updating "+filename
        fdata = copyright + fdata
        if (isUTF):
            file(filename,"w").write(utfstr+fdata)
        else:
            file(filename,"w").write(fdata)

def recursive_traversal(dir,  oldcopyright, copyright):
    global excludedir
    fns = os.listdir(dir)
    print "listing "+dir
    for fn in fns:
        fullfn = os.path.join(dir,fn)
        if (fullfn in excludedir):
            continue
        if (os.path.isdir(fullfn)):
            recursive_traversal(fullfn, oldcopyright, copyright)
        else:
            if (fullfn.endswith(".js")):
                update_source(fullfn, oldcopyright, copyright)


oldcright = file("apache_license_header.txt","r+").read()
cright = file("apache_license_header.txt","r+").read()
recursive_traversal("..", oldcright, cright)
exit()
