from distutils.core import setup, Extension

setup(name = "YoungTab", 
      version = "1.0",
      long_description = "blablabla",
      url = "",
      author = "blabla",
      author_email = "bla@bla",
      license = "",
      ext_modules = [Extension("YoungTab", sources=["YoungTableauxBib.c"])],
)
