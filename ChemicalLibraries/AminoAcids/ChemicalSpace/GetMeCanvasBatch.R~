############
library(rgl)
library(ChemmineR)
#############
files<-list.files(pattern="_coord.rda", recursive=F)
#############
rgl4Me<-function(t){
#############
load(files[t])
#############
rgl.open(); offset <- 50; par3d(windowRect=c(offset, offset, 640+offset,
640+offset))
#############
rm(offset); rgl.clear(); rgl.viewpoint(theta=45, phi=30, fov=60, zoom=1)
#############
colorZ<-as.vector(coord[,4])
#############
spheres3d(coord[,1], coord[,2], coord[,3], radius=0.005, color=coord[,4], alpha=1, shininess=20); aspect3d(1, 1, 1)
############
axes3d(col="black"); title3d("", "", "", "", "", col="black"); bg3d("white")
############
############
pngName<-paste(files[t],"rglSpacesWColorZ", sep="")
############
rgl.snapshot(pngName)
############
writeWebGL(dir=file.path(getwd(), t), width=6400)
############
rgl.close()
############
}
###################
t<-1:length(files) 
lapply(t, rgl4Me)
#############
############
###########
##########
#########
########
#######
######
#####
####
###
##
#

