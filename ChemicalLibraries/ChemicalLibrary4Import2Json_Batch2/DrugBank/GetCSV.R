library(ChemmineR)

sdfset<-read.SDFset("approved.sdf")
valid <- validSDF(sdfset); sdfset <- sdfset[valid]


Structure<-datablocktag(sdfset, tag="SMILES")
Name<-datablocktag(sdfset, tag="IUPAC_NAME")
Groups<-rep("FDAapprovedDrugs", length(sdfset))

SendOut<-cbind(Groups, Name, Structure)


head(SendOut)

write.csv(SendOut, file="FDA_approved_drugs4Json.csv", quote=TRUE, sep="", col.names=FALSE)

#some shit cleaned with replace
