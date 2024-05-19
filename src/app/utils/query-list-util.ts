import { QueryList } from '@angular/core';

/** Class that contains utility methods for `QueryList` */
export class QueryListUtil {
  /**
   * Find the index which matched by `comparator`.
   * @param queryList - Original `QueryList` to find index.
   * @param comparator - Comparison callback function to find index from the `QueryList`.
   * @return When matching item is found, return the index. If not, return -1.
   */
  static findIndex<Comp>(
    queryList: QueryList<Comp> | undefined,
    comparator: (component: Comp) => boolean,
  ): number {
    let searchedIndex = -1;

    // To stop when searched, use 'some()' method
    queryList?.some((component, index) => {
      const result = comparator(component);

      if (result) {
        searchedIndex = index;
      }

      return result;
    });

    return searchedIndex;
  }
}
