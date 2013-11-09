import pandas as pd
import pybel
import openbabel as ob
from StringIO import StringIO

def smi_to_chembrain(smi_repr, from_format='smi'):
    if not smi_repr:
        return {}
    mol = pybel.readstring(from_format, smi_repr)
    mol.addh()
    df = pd.read_csv(StringIO(mol.write(format='ct')),
                        skiprows=len(mol.atoms) + 2,
                        sep='\s+', header=None)

    molecule = [a.atomicnum for a in mol.atoms]

    links = [list(row.iloc[[0, 1]])
                for _, row in df.iterrows()]

    return {"nodes": [{"atomicNumber": molecule, "id": i}
                            for i, molecule in enumerate(molecule, 1)],
            "linkPairs": links}


