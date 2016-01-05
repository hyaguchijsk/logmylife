#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import codecs

from mpl_toolkits.mplot3d import Axes3D
import matplotlib.pyplot as plt

import numpy as np

from sklearn.cluster import DBSCAN
from sklearn import metrics
from sklearn.datasets.samples_generator import make_blobs
from sklearn.preprocessing import StandardScaler

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

    ## calc
    ## PFC balance
    p_energy_list = []
    f_energy_list = []
    c_energy_list = []
    pfc = []
    for (energy, protein, fat, carbo) in zip(energy_list, protein_list, fat_list, carbo_list):

        p_energy = protein * 4.0 / energy
        f_energy = fat * 9.0 / energy
        c_energy = carbo * 4.0 / energy

        p_energy_list.append(p_energy)
        f_energy_list.append(f_energy)
        c_energy_list.append(c_energy)
        pfc.append([p_energy, f_energy, c_energy])

    es = []
    energy_per_salt = []
    epers_list = []
    for (energy, sodium) in zip(energy_list, sodium_list):
        es.append([energy, sodium])
        epers = sodium / energy
        energy_per_salt.append(epers)
        if epers < 8.0:
            epers_list.append([epers])

    maxeps = max(energy_per_salt)
    mineps = min(energy_per_salt)
    print('range: %f - %f' % (mineps, maxeps))
    epstick = (maxeps - mineps) / 349
    epshist = [0] * 350
    for epers in energy_per_salt:
        idx = int((epers - mineps) / epstick)
        epshist[idx] = epshist[idx] + 1
    print(epshist)

    ## for clustering
    X = StandardScaler().fit_transform(epers_list, [len(energy_list), 1])
    # X = StandardScaler().fit_transform(es, [len(energy_list), 2])
    # X = StandardScaler().fit_transform(pfc, [len(energy_list), 3])
    labels_true = np.zeros(len(energy_list))

    ## 2D plot
    # plt.plot(energy_list, sodium_list, 'o')
    # plt.xlabel('energy')
    # plt.ylabel('sodium')
    # plt.xlim(0, 1000)
    # plt.ylim(0, 2000)

    ## 3D plot
    # fig = plt.figure()
    # ax = Axes3D(fig)
    # sc = ax.scatter3D(p_energy_list, f_energy_list, c_energy_list)
    # ax.set_xlabel('protein')
    # ax.set_ylabel('fat')
    # ax.set_zlabel('carbo')
    # ax.set_xlim(0.0, 1.0)
    # ax.set_ylim(0.0, 1.0)
    # ax.set_zlim(0.0, 1.0)

    # plt.show()


    ##############################################################################
    # Compute DBSCAN
    db = DBSCAN(eps=0.05, min_samples=5).fit(X)
    core_samples_mask = np.zeros_like(db.labels_, dtype=bool)
    core_samples_mask[db.core_sample_indices_] = True
    labels = db.labels_

    # Number of clusters in labels, ignoring noise if present.
    n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)
    
    print('Estimated number of clusters: %d' % n_clusters_)
    # print("Homogeneity: %0.3f" % metrics.homogeneity_score(labels_true, labels))
    # print("Completeness: %0.3f" % metrics.completeness_score(labels_true, labels))
    # print("V-measure: %0.3f" % metrics.v_measure_score(labels_true, labels))
    # print("Adjusted Rand Index: %0.3f"
    #       % metrics.adjusted_rand_score(labels_true, labels))
    # print("Adjusted Mutual Information: %0.3f"
    #       % metrics.adjusted_mutual_info_score(labels_true, labels))
    print("Silhouette Coefficient: %0.3f"
          % metrics.silhouette_score(X, labels))

    ##############################################################################
    # Plot result
    # Black removed and is used for noise instead.
    unique_labels = set(labels)
    colors = plt.cm.Spectral(np.linspace(0, 1, len(unique_labels)))

    # fig = plt.figure()
    # ax = Axes3D(fig)

    for k, col in zip(unique_labels, colors):
        if k == -1:
            # Black used for noise.
            col = 'k'

        class_member_mask = (labels == k)

        xy = X[class_member_mask & core_samples_mask]

        # ax.scatter3D(xy[:, 0], xy[:, 1], xy[:, 2],
        #              marker='o', c=col,
        #              edgecolors='k', s=14)
        # plt.plot(xy[:, 0], xy[:, 1], 'o', markerfacecolor=col,
        #          markeredgecolor='k', markersize=14)
        plt.plot(xy[:, 0], [0] * len(xy), 'o', markerfacecolor=col,
                 markeredgecolor='k', markersize=14)

        xy = X[class_member_mask & ~core_samples_mask]
        # ax.scatter3D(xy[:, 0], xy[:, 1], xy[:, 2],
        #              marker='o', c=col,
        #              edgecolors='k', s=6)
        # plt.plot(xy[:, 0], xy[:, 1], 'o', markerfacecolor=col,
        #          markeredgecolor='k', markersize=6)
        plt.plot(xy[:, 0], [0] * len(xy), 'o', markerfacecolor=col,
                 markeredgecolor='k', markersize=6)


    plt.title('Estimated number of clusters: %d' % n_clusters_)
    plt.show()
