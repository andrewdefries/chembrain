##################
library(ChemmineR)
library(fmcsR)
##################
files <- list.files(recursive=FALSE, pattern=".sdf")
##################
A <-c(3)
B <-c(3)
##################
#CladeSelection <-c("B","C","D","E","Gi","Gii", "I", "Lii", "Li", "M", "N")
CladeSelection <-c("chemicalize_Fig3A_name_final_pdf.sdf")
##################		  
DoThis <- function(a){
##################
name <- gsub(".sdf", "", CladeSelection[a])
png_name <- paste(name, "_hclust.png", sep="")
png_name2 <- paste(name, "_SAR.png", sep="")
pdf_name <- paste(name, "_plot.pdf", sep="")
table_name <- paste(name, "_SAR.txt", sep="")
html_name <- paste(name, "_SAR.html", sep="")
##################
png(file=png_name, width=2000, height=1200, units="px")
##################
sdfset <- read.SDFset(CladeSelection[a])
valid <- validSDF(sdfset)
sdfset <- sdfset[valid]
#apset<-sdf2ap(sdfset)
#sdfset<-sdfset[-which(sapply(as(apset, "list"), length)==1)]
##################
#blockmatrix <-datablock2ma(datablocklist=datablock(sdfset))
#blockmatrix[,4]<-gsub("\\s__","",blockmatrix[,4])
#IDs<-blockmatrix[,4]
#blockmatrix[,4]<-gsub("CLK","",blockmatrix[,4])
#blockmatrix[,4]<-gsub("_","",blockmatrix[,4])
#datablock(sdfset)<-blockmatrix
#blockmatrix <-datablock2ma(datablocklist=datablock(sdfset))
##################
#cid(sdfset)<-datablocktag(sdfset,tag="Click_ID")
##################
cid(sdfset)<-sdfid(sdfset)
##################
cid(sdfset)<-paste(seq(1:length(sdfset)), ". ", cid(sdfset), sep="")
##################
d <- sapply(cid(sdfset), function(x)
fmcsBatch(sdfset[x], sdfset, au=0, bu=0,
matching.mode="aromatic")[,"Overlap_Coefficient"])
##################
##################
##################
hc <- hclust(as.dist(1-d), method="complete")
hc[["labels"]] <- cid(sdfset)
plot(as.dendrogram(hc), edgePar=list(col=4, lwd=2), horiz=TRUE, main=name)
dev.off()
##################
write.table(round(d[order(rev(hc$order)),]*100), file=table_name, sep=" & ", quote=FALSE)
Fix<-round(d[order(rev(hc$order)),]*100)
save(Fix, file="nnm.rda", compress=TRUE)
##################
pdf(file="HeatMapforCladogram.pdf") 
library(plotrix)
##
load("nnm.rda")
##
a<-Fix
##
n<-length(colnames(a))
##
#
color2D.matplot(a,c(0,1),c(0,0),c(0,0),show.legend=TRUE,show.values=FALSE,axes=FALSE)
#
##axis(3,at=seq(1, n, 1)-0.50,labels=substring(colnames(d[order(rev(hc$order)),]), 1, 3))
##axis(2,at=seq(1, n, 1)-0.50,labels=substring(rev(rownames(d[order(rev(hc$order)),])), 1, 3))
#
box()
##
dev.off()
##################
library(hwriter)
p=openPage(html_name)
##
load("nnm.rda")
##
colnames(Fix)<-1:length(colnames(Fix))
##
#colors<=c('#000000','#FFFFFF')
##
hwrite(Fix, p, br=TRUE)
##
closePage(p)
##################
printZ<-seq(1:length(A))
#printZ <- paste(printZ, ". CLK", cid(sdfset), sep="")
##################
pdf(file=pdf_name)
plot(sdfset, griddim=c(A[a],B[a]), print_cid=printZ)
dev.off()
}
##################
a <- 1#:length(CladeSelection)
##################
lapply(a, DoThis)
##################

