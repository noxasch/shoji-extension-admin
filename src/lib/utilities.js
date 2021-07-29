export default {
  /**
   * Utility function since can't use post-fix assert in JSDoc
   *  - Takes any union type and excludes `null`
   * @template T
   * @param {T} thing
   * @returns {Exclude<T, null>}
   */
  assertNonNull: function assertNonNull(thing) {
    return /** @type {Exclude<T, null>} */ (thing);
  },
};
