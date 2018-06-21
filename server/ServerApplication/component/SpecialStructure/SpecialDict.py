class SpecialDict(dict):
    def __len__(self):
        return dict.__len__(self) / 2

    def __setitem__(self, key, value):
        dict.__setitem__(self, key, value)
        dict.__setitem__(self, value, key)

    def pop(self, key):
        value = dict.__getitem__(self,key)
        dict.__delitem__(self,key)
        dict.__delitem__(self,value)