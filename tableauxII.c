#include <python2.7/Python.h>
#include<stdio.h>
#include<stdlib.h>
#include<string.h>

#include "YoungTableauxBib.c"


int main(){

int *tableaux = (int*)malloc(sizeof(int));
int n = 4; //n is gonna be the number of LINES of the first tableau, not the number of columns.

//int tab1[] = {2, 1, 1, 0}, tab2[] = {2, 1, 1, 0}; 

//printf("Tensor product in SU(%d): %d x %d \n\n",n, dimensionRep(tab1, n), dimensionRep(tab2, n));

//tensorProd(tab1, tab2, n, 0, n - 1);
//printf("\n");

    
    printf("Enter the number of lines of the tableaux\n");
    scanf("%d", &n);
    
    printf("\n");  
    getTableaux(tableaux, n);
    printf("\n");
    //printTableaux(tableaux, n);
    //printf("\n");      
    //hookMatrix(tableaux, n);
    //printf("\n"); 
    dimensionTableaux(tableaux, n + 1); //This crushes for SU(9). I need to SOLVE THIS ISSUE!!!
    printf("\n"); 
    //printf("Dimension of the rep: %0.0lf\n\n", dimensionRep(tableaux, n+1));
    

return 0;

}
