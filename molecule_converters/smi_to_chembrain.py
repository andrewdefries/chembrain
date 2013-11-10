import json

import pandas as pd
import pybel
import openbabel as ob
from StringIO import StringIO

smi_files = [
    "./ChemicalLibraries/AminoAcids/2D_depiction/AminoAcidsAll.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/AminoAcidsAllWNames.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split1.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split10.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split11.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split12.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split13.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split14.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split15.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split16.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split17.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split18.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split19.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split2.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split20.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split3.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split4.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split5.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split6.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split7.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split8.smi",
    "./ChemicalLibraries/AminoAcids/2D_depiction/SDF2PDF/AminoAcidsAllWNames.sdf.split9.smi",
    "./ChemicalLibraries/AminoAcids/AminoAcidsAll.smi",
    "./ChemicalLibraries/Nucleotides/2D_depiction/SDF2PDF/NucleotidesAllWNames.sdf.split1.smi",
    "./ChemicalLibraries/Nucleotides/2D_depiction/SDF2PDF/NucleotidesAllWNames.sdf.split2.smi",
    "./ChemicalLibraries/Nucleotides/2D_depiction/SDF2PDF/NucleotidesAllWNames.sdf.split3.smi",
    "./ChemicalLibraries/Nucleotides/2D_depiction/SDF2PDF/NucleotidesAllWNames.sdf.split4.smi",
    "./ChemicalLibraries/Nucleotides/2D_depiction/SDF2PDF/NucleotidesAllWNames.sdf.split5.smi",
    "./ChemicalLibraries/Nucleotides/Nucleotides.smi",
    "./ChemicalLibraries/Nucleotides/NucleotidesAllWNames.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split1.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split10.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split11.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split12.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split13.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split14.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split15.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split16.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split17.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split18.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split19.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split2.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split20.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split21.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split22.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split23.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split24.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split25.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split26.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split27.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split28.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split29.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split3.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split30.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split31.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split32.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split33.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split34.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split35.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split36.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split37.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split38.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split4.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split5.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split6.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split7.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split8.smi",
    "./ChemicalLibraries/YAWYE/2D_depiction/SDF2PDF/YAWYEAllWNames.sdf.split9.smi",
    "./ChemicalLibraries/YAWYE/YAWYE.smi",
    "./ChemicalLibraries/YAWYE/YAWYEAllWNames.smi"
]

def write_all_to_json():
    output = {}
    for filename in smi_files:
        try:
            for line in open(filename, 'r').readlines():
                try:
                    smi, name = line.split('\t')
                    cb_repr = smi_to_chembrain(smi)
                    json.dumps(cb_repr)
                    if name:
                        output[name.strip()] = smi_to_chembrain(smi)
                except:
                    pass
        except IOError:
            pass
    with open('d3/molecules.json','w') as f:
        f.write(json.dumps(output))


def smi_to_chembrain(smi_repr, from_format='smi'):
    if not smi_repr:
        return {}
    mol = pybel.readstring(from_format, smi_repr)
    mol.addh()
    df = pd.read_csv(StringIO(mol.write(format='ct')),
                        skiprows=len(mol.atoms) + 2,
                        sep='\s+', header=None)

    molecule = [a.atomicnum for a in mol.atoms]

    links = [[int(i) for i in row.iloc[[0, 1]]]
                for _, row in df.iterrows()]

    return {"nodes": [{"atomicNumber": molecule, "id": i}
                            for i, molecule in enumerate(molecule, 1)],
            "linkPairs": links}
