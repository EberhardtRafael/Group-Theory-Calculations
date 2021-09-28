#include <stdio.h>
#include <stdlib.h>

void swap(int *x, int *y)
{
    int temp;
    temp = *x;
    *x = *y;
    *y = temp;
}

void permute(int *vec, int vecsize, int m, int n){

    if (m == n){
        for(int k = 0; k < vecsize; k++) printf("%d, ", vec[k]);
        printf("\n");
    }
    
    else
    {
        for (int i = m; i <= n; i++)
        {
            swap(&vec[m], &vec[i]);
            permute(vec, vecsize, m+1, n);
            swap(&vec[m], &vec[i]); //backtrack
        }
    }
}


int main(){

    int vec[] = {1, 2, 3, 4};
    int n = 4;
    
    //for(int i = 0; i < 3; i++) printf("%d, ", vec[i]);
    //printf("\n");
    
    //swap(&vec[0], &vec[2]);
    //for(int i = 0; i < 3; i++) printf("%d, ", vec[i]);
    
    permute(vec, n, 0, n-1);
    
    return 0;
}
