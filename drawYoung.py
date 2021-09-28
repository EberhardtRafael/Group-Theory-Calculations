from YoungTab import *
from abc import ABCMeta, abstractmethod
import matplotlib.pyplot as plt
import numpy as np
import os

#Should I have a Drawing Manager class to take care of drawing any Figure? For SOLID reasons.

class Figure():
    __metaclass__ = ABCMeta 
        
    @abstractmethod
    def DrawFig(self):
        pass
    
            
class Line(Figure):
    def __init__(self, x, y, length):
        self.x0 = x
        self.y0 = y  
        self.length = length
        self.coordx = [self.x0 for ele in range(int(100*length))] 
        self.coordy = np.arange(0, length, 0.01)
            
    def drawFig(self, ax): #I can feel it's not a good practice to pass ax as argument. But, for now, I'm gonna leave it like that.
        ax.plot(x,y + self.y0,'k')
        
    def rotateFig(self, angle):
       self.coordx = [np.cos(angle)*self.coordx[i] + np.sin(angle)*self.coordy[i] for i in range(len(self.coordx))]
       self.coordy = [-(np.sin(angle))*self.coordx[i] + np.cos(angle)*self.coordy[i] for i in range(len(self.coordx))]
        

class Circle(Figure):
    def __init__(self, x, y, radius):

def drawCirc(x0, y0, radius, ax):
    i = np.arange(0, 6.2832, 0.01) 
    x = radius*np.sin(i) + x0 
    y = radius*np.cos(i) + y0
    ax.plot(x,y, 'k')


def drawTableau(tab, x, y, side, ax):     

    nlines = len(tab)
    ncols = tab[0]
    boxheight = side
    minxpos = x
    maxheight = y
    
    if tab[0]:
        for i in range(len(tab)):
            y0 = maxheight-i*boxheight
            y1 = y0-boxheight
            for j in range(tab[i]):
                x0 = minxpos+j*boxheight
                x1 = x0+boxheight
                x = [x0, x1, x1, x0, x0]
                y = [y0, y0, y1, y1, y0]        
                ax.plot(x, y, 'k') #k makes every line same color
    else: drawCirc(x, y-side, 0.02, ax) 
        

    
def drawHorizLine(x0, y0, length, ax):
    x = np.arange(0, length, 0.01)
    y = [y0 for ele in range(int(100*length))]
    ax.plot(x+x0,y, 'k')
    
    
def drawPlusSign(x0, y0, length, ax):
    drawCirc(x0, y0, length/2., ax)
    drawVertLine(x0, y0 - 0.5*length, length, ax)
    drawHorizLine(x0 - 0.5*length, y0, length, ax)

def printListTabs(listTabs):
    
    FigHeight = 10
    FigBase = 10
    
    x = 1
    y = 9
    boxSide = 0.5
    
    plt.style.use('grayscale')
    fig, ax = plt.subplots(figsize=(FigBase, FigHeight))
    ax.set_xlim([0, FigBase])
    ax.set_ylim([0, FigHeight])
    
    ax.axes.xaxis.set_visible(False)
    ax.axes.yaxis.set_visible(False)
    
    for i in range(len(listTabs)): #I wanted to use "for element in listTabs", but I needed to keep track of i.
        drawTableau(listTabs[i], x, y, boxSide, ax)
        if i and i < len(listTabs): drawPlusSign(x - 0.5, y-0.5, 0.5, ax)
        x += boxSide*listTabs[i][0] + 1
    
    plt.show()

def drawTensorProd(tab1, tab2):
    tensorProd(tab1, tab2, "TRUE")
    cu = []    
    try:
        with open('temp.dat') as arq:
            while True:
                line = arq.readline()
                if line: 
                    if "Dim" not in line:
                        #print([int(ele) for ele in list(line.strip().split(" "))])
                        cu.append(([int(ele) for ele in list(line.strip().split(" "))]))
		else: break
    except IOError: print("Problems finding/reading temporary file!")
	
    os.remove('temp.dat')
    printListTabs(cu)   
   
   
tab1 = [2, 1, 0]
tab2 = [3, 1, 1]
listTab = [tab1, tab2, tab1, tab1]
#printListTabs(listTab)
 
tab = [2, 1, 0]
#drawTableau(tab)
drawTensorProd(tab, tab)


