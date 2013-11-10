####################
library(rgl)
library(ChemmineR)
####################
#files <- list.files(recursive=TRUE, pattern = "_coord.rda")
#files <- list.files(recursive=TRUE, pattern = "_sdfset.rda")
files <- list.files(recursive=TRUE, pattern = ".sdf")
####################
#par(mfrow=c(3,3))
####################
DoThis<-function(a){
        mo_name<-gsub("_sdfset.rda","",files[a])
        coord_name<-paste(mo_name,"_coord.rda", sep="")
        sdfset_name<-paste(mo_name,"_sdfset.rda",sep="")
        fpset_name<-paste(mo_name,"_fpset.rda",sep="")
	png_name<-paste(mo_name, ".png",sep="")
        ################
        sdfset<-read.SDFset(files[a])
        ################
        valid <- validSDF(sdfset)
        sdfset <- sdfset[valid]
       	apset <-sdf2ap(sdfset)
	sdfset<-sdfset[!sapply(as(apset, "list"), length)==1]
	
	fpset<-desc2fp(apset)
	clusters <- cmp.cluster(fpset, cutoff = c(0.7))
	coord <- cluster.visualize(db=apset, clusters,size.cutoff=1, dimensions=3, quiet=TRUE)
	#load(coord_name[a])
	save(sdfset,file=sdfset_name, compress=T)
	save(fpset,file=fpset_name, compress=T)
	save(coord,file=coord_name, compress=T)
        ########
        #rgl.open(); offset <- 50; par3d(windowRect=c(offset, offset, 640+offset, 640+offset))
        #rm(offset); rgl.clear(); rgl.viewpoint(theta=45, phi=30, fov=60, zoom=1)
        #spheres3d(coord[,1], coord[,2], coord[,3], radius=0.005, color="black", alpha=1, shininess=20); aspect3d(1, 1, 1)
        #axes3d(col='black'); title3d("", "", "", "", "", col='black'); bg3d("white") # To save a snapshot of the graph, one can use the command
        ################
        #rgl.snapshot(png_name[a])
        #rgl.close()
        ################        
        #sdfset<-sdfset[-which(sapply(as(apset, "list"), length)==1)]
        #write.SDF(sdfset,file=sdfset_name,sig=TRUE)
        #################
        
        #################
}
a<-1:length(files)
lapply(a,DoThis)
####################
