import { expect } from 'chai';
import { Cache, CacheType } from '../src';

describe('Lru tests', () => {
  let cache: CacheType<string, any>;

  beforeEach(() => {
    // cache.clear();
  });

  describe('instance', () => {
    it('using new', () => {
      cache = new Cache<string, any>(2);
      expect(cache instanceof Cache).to.be.true; 
    });

    it('using create', () => {
      cache = Cache.create<string, any>(2);
      expect(cache instanceof Cache).to.be.true; 
    });
  });

  describe('set & get', () => {
    before(() => {
      cache = new Cache<string, string>(2);
    });

    it('set value', () => {
      cache.set('k', 'v');
      expect(cache.get('k')).to.equal('v');
      cache.set('k1', null);
      expect(cache.get('k1')).to.be.null;
      cache.set('k2', undefined);
      expect(cache.get('k2')).to.be.undefined;
      expect(cache.get('k')).to.be.undefined;
    });

    it('get value', () => {
      expect(cache.get('k')).to.be.undefined;
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      cache = new Cache<string, string>(2);
    });

    it('unexist', () => {
      expect(cache.remove('k')).to.be.false;
    });

    it('exist', () => {
      cache.set('k', 'v');
      expect(cache.remove('k')).to.be.true;
      expect(cache.remove('k')).to.be.false;
    });

    it('exist last', () => {
      cache.set('k', 'v');
      cache.set('k1', 'v1');
      expect(cache.remove('k')).to.be.true;
    })
  });

  describe('size & clear & empty & full', () => {
    before(() => {
      cache = new Cache<string, string>(2);
    });

    it('size', () => {
      expect(cache.size()).to.equal(0);
    });

    it('empty', () => {
      expect(cache.empty()).to.true;
    });

    it('full', () => {
      cache.set('k', 'v');
      expect(cache.size()).to.equal(1);
      cache.set('k', { x: 1 });
      expect(cache.size()).to.equal(1);
      expect(cache.full()).to.be.false;
      cache.set('k2', 'v');
      expect(cache.size()).to.equal(2);
      expect(cache.full()).to.be.true;
    });

    it('clear', () => {
      cache.set('k3', 'v');
      expect(cache.size()).to.equal(2);
      cache.clear();
      expect(cache.size()).to.equal(0);
      expect(cache.empty()).to.true;
    });
  });

  describe('hits', () => {
    beforeEach(() => {
      cache = new Cache<string, string>(10);
    });

    it('hit 0', () => {
      cache.get('k');
      expect(cache.hits()).to.deep.equal({ count: 0, rate: 0 });
      cache.set('k', 'v');
    });

    it('hit 50', () => {
      expect(cache.get('k')).to.be.undefined;
      cache.set('k', 'v');
      expect(cache.get('k')).to.be.equal('v');
      expect(cache.hits()).to.deep.equal({ count: 1, rate: 0.5 });
    });

    it('hit 100', () => {
      cache.set('k', 'v');
      cache.get('k');
      cache.set('k2', 'v');
      cache.get('k2');
      expect(cache.hits()).to.deep.equal({ count: 2, rate: 1 });
    });
  });

  describe('hasKey', () => {
    before(() => {
      cache = new Cache<string, string>(10);
    });

    it('false', () => {
      expect(cache.hasKey('k')).to.be.false;
    });

    it('true', () => {
      cache.set('k', 'v');
      expect(cache.hasKey('k')).to.be.true;
    });

    it('clear', () => {
      expect(cache.hasKey('k')).to.be.true;
      cache.clear();
      expect(cache.hasKey('k')).to.be.false;
    });
  })
})
