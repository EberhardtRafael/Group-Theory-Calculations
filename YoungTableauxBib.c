#include <python2.7/Python.h>
#include<stdio.h>
#include<stdlib.h>
#include<string.h>

#include "YoungTableaux.h"


//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------
static PyObject *Function_tensorProd(PyObject *self, PyObject *args);

static PyMethodDef module_methods[] = {
    {"tensorProd", (PyCFunction)Function_tensorProd, METH_VARARGS, ""},
    {NULL, NULL, 0, NULL}
};

void initYoungTab(void){
    PyObject* mod;
    mod = Py_InitModule3("YoungTab", module_methods, "");
    if(mod == NULL){
        return;
    }
}

//---------------------------------------------------------------------------------------------------------------------

double elementHook(int *arr, int line, int col, int n){

int i = line;
double hook = arr[line] - col; //First we count the number of elements to the right of the given element.
    
    //Then we count the number of elements downards from the given element.
    //If the line below has grater or equal size to the one the given element belongs to, certainly there is an element below it.
    
    while(i < n - 1 && arr[1 + i++] >= col + 1) hook++;   
      
    return hook;
}

//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------


void hookMatrix(int *arr, int n){

    printf("The matrix of hook numbers of the tableaux:\n\n");
    
    for(int i = 0; i < n; i++){
        for(int j = 0; j < arr[i]; j++) printf("%0.0lf ", elementHook(arr, i, j, n));        
        printf("\n");    
    } 
}


//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

char* checkEntry(){

char *entry = (char*)malloc(sizeof(char));

do{
    
    scanf(" %s", entry);
    if(strcmp(entry, "1") > 10 || strcmp(entry, "1") < 0) printf("Invalid entry!\n\n");
    
}while(strcmp(entry, "1") < 0 || strcmp(entry, "1") > 10);

    return entry;
}

//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

void getTableaux(int *entry, int n){

//int entry[n];
 
    printf("Enter the number of boxes for each line of the tableaux.\n");
    
    //For now, I'm just gonna trust the user. ALthough, I should use above function to test for the tyoe of the entry in future version.
    for(int i = 0; i < n; i++) scanf(" %d", &entry[i]);
    
    //for(int i = 0; i < n; i++) printf("%d, ", entry[i]);
}

//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------


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
    printf("\n"); 
}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------

void printTableaux(int *arr, int n){

    //printf("The tableaux:\n\n");
    for(int i = 0; i < n; i++) box(arr[i]);
}

//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

void dimensionTableaux(int *arr, int n){

    printf("The \"dimension\" tableaux:\n");
    for(int i = 0; i < n - 1; i++){
        for(int j = 0; j < arr[i]; j++) printf("%d ", (n - i) + j);
        printf("\n");
    }
}

//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------


double dimensionRep(int *arr, int n){

double dim = 1;

    for(int i = 0; i < n - 1; i++)
        for(int j = 0; j < arr[i]; j++) dim *= (((n - i) + j)/elementHook(arr, i, j, n));    
        //printf("%0.f\n", dim);
      
    return dim;
}

//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

int sumVec(int *Vec, int n){

int sum = 0;

for(int i = 0; i < n; i ++) sum+= Vec[i]; 

return sum;

}

//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

void reiniciaVetor(int *vec, int n){
    
    for(int i = 1; i < n; i++) vec[i] = 0;
}

//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

void iteraVetor(int *vec, int n){
    
    int i = 0;
    int troca = 0;

    if(vec[n-1] == vec[0]){         
        if(vec[0]) reiniciaVetor(vec, n);
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


//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

int tudoIgual(int *vec, int n){

    int tudoigual = 1;

    for(int i = 1; i < n; i++)
        if(vec[0] == vec[i]) tudoigual *= 1;
        else tudoigual *= 0;

    return tudoigual;
}


//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

void swap(int *x, int *y)
{
    int temp;
    temp = *x;
    *x = *y;
    *y = temp;
}

//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

int verificaComb(int *vec, int vecsize, int *tableau1, int index){

    int result = 1;
    
    for(int i = 0; i < vecsize - 1; i++){
        if(tableau1[i+1] + vec[i+1] > tableau1[i]) result *= 0;
    }
    
    if(index && vec[0]) result = 0;        
   
    return result;
}

//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

int permute(int *vec, int vecsize, int m, int n, int *tableau1, int cols, int combs[][cols], int p, int index){

  if (m == n){
        if(verificaComb(vec, vecsize, tableau1, index)){
        for(int k = 0; k < vecsize; k++) combs[p][k] = tableau1[k] + vec[k]; 
             p++;
        }
    }else{
        for (int i = m; i <= n; i++){   
            swap(&vec[m], &vec[i]);
            p = permute(vec, vecsize, m+1, n, tableau1, cols, combs, p, index);
            
            swap(&vec[m], &vec[i]); //backtrack
        }
    }
    
    return p;
}

//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

int fatorial(int n){
    
    if(!n) return 1;
    else return n*fatorial(n-1);

}

//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

void printVec(int *vec, int n){

    for(int i = 0; i < n; i++) printf("%d, ", vec[i]);
    printf("\n");

}

//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

void printProductTableau(int cols, int rows, int tab[rows][cols], int index, int printToFile, FILE* tempfile){

int equal, aux;

    //printf("%d round of the multiplication.\n", index + 1);
    
    if(printToFile) tempfile = fopen("temp.dat", "a");
    
    if(tempfile == NULL){
        printf("Error: problems creating temporary file!");
        printToFile = 0;
    } 
    
    for(int i = 0; i < rows; i++){
        aux = 0;
        for(int k = 0; k <= i; k++){
            if(k != i){
                equal = 1;
                for(int j = 0; j < cols; j++){
                    if(tab[i][j] == tab[k][j]) equal *= 1;
                    else equal *= 0;
                }
                aux += equal;
            }
        }
        if(!aux){
            if(tab[i][0]){
                if(index < cols - 2){ //It must be cols - 2 here, because cols is not the number of cols in a tableau, but the number of cols in combs, which is a matrix whose lines are themselves tableaux, and the number os columns in combs is the number os lines in those tableaux. Therefore, cols - 2 means the number os lines of the tableau - 2.
                    for(int j = 0; j < cols - 1; j++) printf("%d, ", tab[i][j]);
                    printf("%d\n", tab[i][cols - 1]);
                    // One should comment this part of the code in order to simplify the results for bigger tableaux. It serves only for controlling each stepp of the multiplication.    
                    //if(printToFile){
                    //    for(int j = 0; j < cols - 1; j++) fprintf(tempfile, "%d ", tab[i][j]);
                    //    fprintf(tempfile, "%d\n", tab[i][cols - 1]);
                    //}
                }else{
                    if(!tab[i][cols-1]){ 
                        for(int j = 0; j < cols-2; j++) printf("%d, ", tab[i][j]);
                        printf("%d\n", tab[i][cols-2]);
                        printf("Dim: %0.0lf\n", dimensionRep(*(tab+i), cols));
                        if(printToFile){
                            for(int j = 0; j < cols-2; j++) fprintf(tempfile, "%d ", tab[i][j]);
                            fprintf(tempfile, "%d\n", tab[i][cols-2]);
                            fprintf(tempfile, "Dim: %0.0lf\n", dimensionRep(*(tab+i), cols));
                        }
                        //printTableaux(*(tab + i), rows);
                    }else{
                        for(int j = 0; j < cols-2; j++) printf("%d, ", tab[i][j] - tab[i][cols-1]);
                        printf("%d\n", tab[i][cols-2] - tab[i][cols-1]);
                        printf("Dim: %0.0lf\n", dimensionRep(*(tab+i), cols));
                        if(printToFile){
                            for(int j = 0; j < cols-2; j++) fprintf(tempfile, "%d ", tab[i][j] - tab[i][cols-1]);
                            fprintf(tempfile, "%d\n", tab[i][cols-2] - tab[i][cols-1]);
                            fprintf(tempfile, "Dim: %0.0lf\n", dimensionRep(*(tab+i), cols));
                        }
                    } 
                }
            }
        }
    }
    
    if(printToFile) fclose(tempfile);
    
}

//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------


void tensorProd(int *tableau1, int *tableau2, int n, int index, int roundsToRun, int printToFile, FILE* tempfile){

    int *vec = (int*)calloc(n, sizeof(int));
    int aux[n];
    int m = fatorial(n) + 2;
    int combs[m][n]; //This is not a tableau! Each line of this matrix represents one tableau! That's why it must have n cols.
    int auxeq, equal;
    
    if(roundsToRun){
        for(int i = 0; i < m; i++)
           for(int j = 0; j < n; j++) combs[i][j] = 0;
    
        for(int j = 0; j < n*n + 1; j++){

            for(int i = 0; i < n; i++) aux[i] = vec[i];

            if(sumVec(vec, n) == tableau2[index]){
            
                if(tableau2[index] > 1){
                    if(vec[0] == tableau2[index]){
                
                        for(int i = 0; i < n; i++){
                            //printf("%d, ",tableau1[i] + vec[i]);
                            combs[0][i] = tableau1[i] + vec[i];
                        }
                        //printf("\n");
                    }
                    else if(!tudoIgual(vec, n)){
                        permute(vec, n, 0, n - 1, tableau1, n, combs, 1, index);
                    }else{
                        if(verificaComb(vec, n, tableau1, index))
                            for(int i = 0; i < n; i++){
                                //printf("%d, ",tableau1[i] + vec[i]);
                                combs[m-1][i] = tableau1[i] + vec[i];
                            }    
                            //printf("\n");
                        }
                }else permute(vec, n, 0, n - 1, tableau1, n, combs, 0, index);
            } 
                iteraVetor(vec, n);  
        }   
  
        printProductTableau(n, m, combs, index, printToFile, tempfile);
        printf("\n");
        //if(printToFile) printProductTableautoFile(n, m, combs, index, tempfile);
    
        for(int i = 0; i < m; i++){
            auxeq = 0;
            for(int k = 0; k <= i; k++){
                if(k != i){
                    equal = 1;
                    for(int j = 0; j < n; j++){
                        if(combs[i][j] == combs[k][j]) equal *= 1;
                        else equal *= 0;
                    }
                    auxeq += equal;
                }
            }
            if(!auxeq){
                if(combs[i][0]){
                tensorProd(*(combs+i), tableau2, n, index + 1, roundsToRun-1, printToFile, tempfile);
                }
            }
        }
        //printf("\n");
    }
}


//---------------------------------------------------------------------------------------------------------------------

static PyObject *Function_tensorProd(PyObject *self, PyObject *args){
    
    PyObject* tab1;
    PyObject* tab2;
    int *dbar1, *dbar2;
    FILE *tempfile;
    char *str = NULL;
    int printToFile = 0;
    //double result;
    int tablen1, tablen2;
    int i;
    
    if(!PyArg_ParseTuple(args, "OOs", &tab1, &tab2, &str)) return 0;
    tab1 = PySequence_Fast(tab1, "argument must be iterable");
    tab2 = PySequence_Fast(tab2, "argument must be iterable");
    
    if(!tab1)
        return 0;
    if(!tab2)
        return 0;
        
    tablen1 = PySequence_Fast_GET_SIZE(tab1);
    tablen2 = PySequence_Fast_GET_SIZE(tab2);
    dbar1 = malloc(tablen1*sizeof(double));
    dbar2 = malloc(tablen2*sizeof(double));
    
    if(!strcmp(str, "TRUE")) printToFile = 1;
    
    if(!dbar1) {
        Py_DECREF(tab1);
        return PyErr_NoMemory(  );
    }
    
    if(!dbar2) {
        Py_DECREF(tab2);
        return PyErr_NoMemory(  );
    }
    
    for(i=0; i < tablen1; i++) {
        PyObject *fitem1;
        PyObject *item1 = PySequence_Fast_GET_ITEM(tab1, i);
        if(!item1) {
            Py_DECREF(tab1);
            free(dbar1);
            return 0;
        }
        fitem1 = PyNumber_Float(item1);
        if(!fitem1) {
            Py_DECREF(tab1);
            free(dbar1);
            PyErr_SetString(PyExc_TypeError, "all items must be numbers");
            return 0;
        }
        dbar1[i] = PyFloat_AS_DOUBLE(fitem1);
        Py_DECREF(fitem1);
    }
    
    for(i=0; i < tablen2; i++) {
        PyObject *fitem2;
        PyObject *item2 = PySequence_Fast_GET_ITEM(tab2, i);
        if(!item2) {
            Py_DECREF(tab2);
            free(dbar2);
            return 0;
        }
        fitem2 = PyNumber_Float(item2);
        if(!fitem2) {
            Py_DECREF(tab2);
            free(dbar2);
            PyErr_SetString(PyExc_TypeError, "all items must be numbers");
            return 0;
        }
        dbar2[i] = PyFloat_AS_DOUBLE(fitem2);
        Py_DECREF(fitem2);
    }
    
    Py_DECREF(tab1);
    Py_DECREF(tab2);
            
    tensorProd(dbar1, dbar2, tablen1, 0, tablen1 - 1, printToFile, tempfile);
    
        
    return Py_BuildValue("");

}

//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

