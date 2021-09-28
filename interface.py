# Import Module
import Tkinter as tk
import matplotlib.pyplot as plt
from matplotlib.widgets import TextBox

def submit(cu):
    print(cu)

fig, ax = plt.subplots()

# Create Object
appRoot = tk.Tk()
appRoot.title("test")
appRoot.geometry('450x300')


a = [1, 2, 3]

# Create Label and add some text
label = tk.Label(appRoot,text =a[1])

# using place method we can set the position of label
label.place(relx = 0.1, rely = 0.1, anchor ='ne')
 
 
axbox = fig.add_axes([0.1, 0.05, 0.8, 0.075])
text_box = TextBox(axbox, "Evaluate")
text_box.on_submit(submit)
text_box.set_val("t ** 2")  # Trigger `submit` with the initial string.

plt.show()

# Execute Tkinter
appRoot.mainloop()
