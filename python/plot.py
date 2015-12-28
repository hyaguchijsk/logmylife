#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import codecs

from mpl_toolkits.mplot3d import Axes3D
import matplotlib.pyplot as plt
import numpy as np
import json

if __name__ == '__main__':
    # read from food_db.json
    food_db = open(os.environ['HOME'] + '/food_db.json', 'r')
    food_json = json.loads(food_db.read(), 'utf-8')

    name_list = []
    energy_list = []
    protein_list = []
    fat_list = []
    carbo_list = []
    sodium_list = []
    for food_item in food_json:
        try:
            energy = float(food_item['energy'])
            protein = float(food_item['protein'])
            fat = float(food_item['lipid'])
            carbo = float(food_item['carbohydrate'])
            sodium = float(food_item['sodium'])

            energy_list.append(energy)
            protein_list.append(protein)
            fat_list.append(fat)
            carbo_list.append(carbo)
            sodium_list.append(sodium)

            name_list.append(food_item['vendor'] + ":" + food_item['name'])
            # print(food_item['vendor'] + ":" + food_item['name'])
            
        except ValueError:
            None

    # calc


    # plot
    fig = plt.figure()
    ax = Axes3D(fig)
    sc = ax.scatter3D(protein_list, fat_list, carbo_list)
    ax.set_xlabel('protein')
    ax.set_ylabel('fat')
    ax.set_zlabel('carbo')

    plt.show()

