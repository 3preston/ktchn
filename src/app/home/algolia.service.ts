/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from "@angular/core";
import algoliaSearch from 'algoliasearch/lite';

@Injectable({providedIn: 'root'})
export class AlgoliaService {

  searchClient = algoliaSearch(
    'UUQGWXOCJW',
    '0ab340206525409a6515d9ac470b640a'
  );

  configRecipes = {
    indexName: 'recipes',
    routing: true,
    searchClient: this.searchClient
  };

  configUsers = {
    indexName: 'users',
    routing: true,
    searchClient: this.searchClient
  };



}
