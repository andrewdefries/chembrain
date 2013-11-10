

paste YAWYE.smi YAWYE.name > YAWYEAllWNames.smi


babel YAWYEAllWNames.smi -O YAWYEAllWNames.svg
babel YAWYEAllWNames.smi -O YAWYEAllWNames.sdf --gen2d


babel YAWYEAllWNames.smi -O YAWYEAllWNames_3d.svg --gen3d
babel YAWYEAllWNames.smi -O YAWYEAllWNames_3d.sdf --gen3d

echo "done"


#systematic

