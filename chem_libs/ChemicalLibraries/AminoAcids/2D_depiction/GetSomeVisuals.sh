

paste AminoAcidsAll.smi Names > AminoAcidsAllWNames.smi


babel AminoAcidsAllWNames.smi -O AminoAcidsAllWNames.svg
babel AminoAcidsAllWNames.smi -O AminoAcidsAllWNames.sdf --gen2d


babel AminoAcidsAllWNames.smi -O AminoAcidsAllWNames_3d.svg --gen3d
babel AminoAcidsAllWNames.smi -O AminoAcidsAllWNames_3d.sdf --gen3d

echo "done"


#systematic

