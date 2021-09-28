#include<stdio.h>
#include<stdlib.h>

int sumVec(int *Vec, int N){

int sum = 0;

for(int i = 0; i < N; i ++) sum+= Vec[i]; 

return sum;

}

void reiniciaVetor(int *vec, int N){
    
    for(int i = 1; i < N; i++) vec[i] = 0;
}

void iteraVetor(int *vec, int N){
    
    int i = 0;
    int troca = 0;

    if(vec[N-1] == vec[0]){         
        if(vec[0]) reiniciaVetor(vec, N);
        vec[0]++;
    } 
    else{
        while(!troca){        
        
        if(vec[i] - vec[i+1] > 0){
            vec[i + 1]++;
            troca = 1;
        } 
        i++;
    }

    } 
        
}


int main(int argc, char *argv[]){

    int N = 3;

    int vec[N];

    for(int i = 0; i < N; i++) vec[i] = 0;
    
    //iteraVetor(vec, 3);
    //for(int i = 0; i < N; i++) printf("%d, ", vec[i]);
    //printf("\n");

    /*for(int j = 0; j < 10; j++){  
        for(int i = 0; i < N; i++) printf("%d, ", vec[i]);            
        iteraVetor(vec, 3);
        printf("\n");    
    }*/
         
    for(int j = 0; j < 20; j++){  
        if (sumVec(vec, N) == N){
            for(int i = 0; i < N; i++) printf("%d, ", vec[i]);            
            printf("\n");    
        }
        iteraVetor(vec, N);  
    }    



    return 0;
}
