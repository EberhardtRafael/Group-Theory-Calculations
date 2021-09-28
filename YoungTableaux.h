#ifndef _YoungTableaux_H_
#define _YoungTableaux_H_

double elementHook(int *arr, int line, int col, int n);
void hookMatrix(int *arr, int n);
void getTableaux(int *entry, int n);
void box(int n);
void printTableaux(int *arr, int n);
void dimensionTableaux(int *arr, int n);
double dimensionRep(int *arr, int n);
int sumVec(int *Vec, int n);
void reiniciaVetor(int *vec, int n);
void iteraVetor(int *vec, int n);
int tudoIgual(int *vec, int n);
void swap(int *x, int *y);
int verificaComb(int *vec, int vecsize, int *tableau1, int index);
int permute(int *vec, int vecsize, int m, int n, int *tableau1, int cols, int combs[][cols], int p, int index);
int fatorial(int n);
void printVec(int *vec, int n);
void printProductTableau(int cols, int rows, int tab[rows][cols], int index, int printToFile, FILE* tempfile);
void tensorProd(int *tableau1, int *tableau2, int n, int index, int teste, int printToFile, FILE* arq);

#endif
