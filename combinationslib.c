#include "combinations.h"

void swap(int *vec, int N, int i, int j){

    int aux;
    aux = vec[i];
    vec[i] = vec[j];
    vec[j] = aux;

}

void imparPermutation(int *vec, int N){

    for(int i = 0; i < N-1; i++){
        for(int j = N - 1; j > i; j--) swap(vec, N, i, j); 
        for(int i = 0; i < N; i++) printf("%d, ", vec[i]);
        printf("\n");
    }
        
}

void rotateVec(int *vec, int N){

    int prov = vec[N - 1];
    
    for(int i = N - 1; i > 0; i--) vec[i]  = vec[i - 1];
    
    vec[0] = prov;
    
}

void ciclicPermut(int *vec, int N, int Niterac){
    
    for(int i = 0; i < N; i++) printf("%d, ", vec[i]);
    printf("\n");
    rotateVec(vec, N);

    if(Niterac)ciclicPermut(vec, N, Niterac - 1); 
    
}

void allPermut(int *vec, int N, int M, int permutMatrix[][N]){

    int aux[N];
    int line = 0;
    
    for(int i = 0; i < N; i ++){
           
        for(int k = 0; k < N; k ++) aux[k] = vec[k];
        
        for(int l = 0; l <= i; l++) rotateVec(aux, N);

        for(int l = 0; l < N-1; l++){
                       
            for(int m = N - 1; m > l; m--){
                swap(aux, N, l, m);   
            } 
            
            //for(int j = 0; j < N; j++) permutMatrix[line][j] = aux[j];    
            //line++;
            
            for(int i = 0; i < N; i++) printf("%d, ",  aux[i]);
            printf("\n"); 
            
        } 
    }
}
