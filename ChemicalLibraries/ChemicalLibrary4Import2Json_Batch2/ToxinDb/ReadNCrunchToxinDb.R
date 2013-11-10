library(ChemmineR)

#MechanismTable<-read.csv("mechanisms.csv")
#MechanismSystematicName<-MechanismTable[,3]


ToxinTable<-read.csv("toxins.csv")

#SystematicName<-ToxinTable[,5] #Other field exist too

#TDB3_IsomericSmiles <-ToxinTable[,28]

#GroupName<-rep("ToxinDB",length(ToxinTable[,5]))

#ToxinTable[,1]<-rep("ToxinDB",length(ToxinTable[,5]))

#Meat<-cbind(GroupName,SystematicName, TDB3_IsomericSmiles)

#head(Meat)

#Out<-cbind(rep("ToxinDB",length(ToxinTable[,5])),ToxinTable[,5],ToxinTable[,28]) 

#head(Out)



ToxinTable[,5]
ToxinTable[,28]


