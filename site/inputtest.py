# def load(file_name):
#         points = []
#         with open(file_name, "r") as hfile:
#             hfile.readline()
#             i = 0
#             for line in hfile:
#                 x, y = line.split()
#                 point = Point(i, int(x), int(y))
#                 i += 1
#                 points.append(point)
#         return points

def load(inputFile):
        i = 0
        points = [] 
        for k in inputFile:
            print k
            print k[0], k[1]
            point = Point(i,k[0],k[1])
            i+=1
            points.append(point)





# load("inputs/guards.pol")

test = [["0","0"],["2","0"],["2","2"],["1","0.5"]]

load(test)