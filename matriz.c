#include<stdio.h>
#include<stdlib.h>



void teste(int n,int m, int perm[][n]){

    for(int i = 0; i < m; i++)
        for(int j = 0; j < n; j++) perm[i][j] = i;
    
}


int main(int argc, char *argv[]){

int m = 3;
int n = 3;

int mat[m][n];

teste(n, m, mat);

for(int i = 0; i < m; i++){
    for(int j = 0; j < n; j++) printf("%d ", mat[i][j]);
    printf("\n");
}


return 0;
}


