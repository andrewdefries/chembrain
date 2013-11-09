#Andrew Joseph Defries
#Copyright GPL
#andrew.defries@gmail.com
#https://github.com/andrewdefries
#

############
for i in *.sdf
############



############
do
############

echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"

echo "Thank you for exploring the chemical space of this $i SDF"


babel $i $i.split.smi -m
babel $i $i.split.svg -m
babel $i -O $i.svg

#babel *.mol -osmi -m

echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "Done splitting $i"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "Look for $i.svg in your current directory and a folder with the split files for latex"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"

#############
done
#############


echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "Making tex files for $i"
echo "turning pdfs"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
for s in *.smi
##############
do
##############
mol2chemfig -wo $s > $s.tex
#pdflatex this too
##############
done
##############
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "Done"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "making pdfs from the tex files available"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
##
rm PrintBatchMeat.tex
##############
for j in *.smi.tex
##############
####
do
##############
echo "\centering">>PrintBatchMeat.tex
echo "\input{$j}">>PrintBatchMeat.tex
echo "\clearpage" >>PrintBatchMeat.tex
#get name in there
##############
done
##############


cat PrintBatchTop.tex PrintBatchMeat.tex PrintBatchBottom.tex > PrintBatchAll.tex

pdflatex PrintBatchAll.tex

echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"

echo "Done Look for a Big ass pdf"

echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
echo "##################"
