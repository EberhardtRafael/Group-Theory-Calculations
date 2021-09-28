#include<stdio.h>
#include<stdlib.h>
#include<math.h>


//Shape
//tableaux
//standardTableaux
//Nstandard


typedef struct{

int nlines;
int ncol;
int **entries; 
}tableaux;

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------

tableaux* newTableaux(int m, int n){

    tableaux *pt = (tableaux*)malloc(sizeof(tableaux)); 
 
    pt->ncol = m; 
    pt->nlines = n; 
    pt->entries = (int*)malloc(m*n*sizeof(int));
     
    return pt;

}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------

void getTableaux(tableaux *table){

    printf("Enter the entries of the tableaux. Enter 0 for empty box.\n");

    for(int i = 0; i < table->nlines*table->ncol; i++) scanf(" %d ", &table->entries[i]);
    // The program keeps waiting for one more entry than nxm and I don't understand why by now.
    // Enter 0 and everything else works fine.
   
}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------

void printTableaux(tableaux *table){

int count = 0;

    for(int i = 0; i < table->nlines; i++){
        for(int j = 0; j < table->ncol; j++){
            if(!table->entries[count]) printf(" ");
            else printf("%d ", table->entries[count]);
            count++;        
        }
        printf("\n");
    }
}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------

int hook(tableaux *table, int n){

int hook = 0;
int count = 0;

    printf("\n");
    
    for(int i = j*n; i < j*table->ncol; i++){
        if(table->entries[i]) hook++; //Multiplication reffering every entry to the right.
        printf("Entry: %d, %d\n",i, table->entries[i]);
    }
    
    printf("\n");
    
    for(int i = n + table->ncol; i < n + table->nlines*table->ncol; i+= table->ncol){
        if(table->entries[i]) hook++;
        //count++;
        printf("Entru: %d, %d\n", i, table->entries[i]);
    } 
    
    return hook; 

}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------

/*
void hookMatrix(tableaux *table){

int count = 0;
tableaux *hookM;
hookM = newTableaux(table->ncol, table->nlines);

    for(int i = 0; i < table->ncol; i++)
        for(int j = 0; j < table->nlines; j++){
           hookM->entries[count] = hook(table, j, i);
           count++;
        }

printTableaux(hookM);

}
*/
//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------

/*
    Given an integer n, isplays a row of n boxes with the form below:
     ***
    :   :
     ***
*/

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------

void box(int n){
    
    
    for(int i = 0; i < n; i++){ 
        printf(" ");          
        for(int i = 0; i < 3; i++) printf("*");
        printf("  "); 
        }    
    printf("\n");
    
    for(int i = 0; i < n; i++){
        printf(":");
        for(int i = 0; i < 3; i++) printf(" ");
        printf(": ");        
        }     
    printf("\n");
    for(int i = 0; i < n; i++){
        printf(" ");
        for(int i = 0; i < 3; i++) printf("*");
        printf("  ");
        }        
    //printf("\n"); //Only for testing purpouses.
}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------

//Recebe o número de elementos e mostra quantos shapes podem ser montados com esse número
/*

Um shape segue duas regras:
1) O número de elementos em cada linha é não-crescente;
2) As linhas são "left-justified."
*/

void shape(int n){

int m = 0;
int k = 0;

printf("\nAll the possible shapes with %d box(es) are: \n\n", n);
    
    while(n - m >= m){
        box(n-m);
        if(m > 0){
            printf("\n");            
            while(k <= m){ 
                box(m - k); 
                if(k > 0){
                    printf("\n");        
                    box(k);                        
                } 
                k++;                              
            }             
            k = 0;                  
            }
        m++;
        printf("\n\n");           
        }
}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------

//void standardTableaux(int n){




//}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------

int main(){

int m, n, count = 0;
tableaux *table;

printf("Enter the maxium ammount ob boxes to the right and downards\n");
scanf(" %d %d", &m, &n);

table = newTableaux(m, n);

getTableaux(table); 
printf("\n");   
printTableaux(table);
printf("\n");
//hookMatrix(table);
//printf("\n%d\n", table->entries[0]);
//printf("\n%d\n", table->entries[0 + table->ncol]);
//printf("\n%d\n", table->entries[0 + 2*table->ncol]);
printf("\ncu: %d \n", hook(table, 0));
printf("\ncu: %d \n", hook(table, 1));
printf("\ncu: %d \n", hook(table, 2));
printf("\ncu: %d \n", hook(table, 3));
printf("\ncu: %d \n", hook(table, 4));

//box(3);
//printf("\t");
//box();
//shape(3);

return 0;

}
