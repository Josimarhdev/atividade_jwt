import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProdutosService } from './produtos.service';
import { Produto } from '../models/produto';

describe('ProdutosService', () => {
  let service: ProdutosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProdutosService]
    });

    service = TestBed.inject(ProdutosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve products from the API via GET', () => {
    const mockProducts: Produto[] = [
      { id: 1, nome: 'Produto 1', valor: 10.5 },
      { id: 2, nome: 'Produto 2', valor: 20.0 }
    ];

    service.listAll().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/produto');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should save a product via POST', () => {
    const newProduct: Produto = { id: 3, nome: 'Novo Produto', valor: 15.75 };

    service.save(newProduct).subscribe((product) => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/produto');
    expect(req.request.method).toBe('POST');
    req.flush(newProduct);
  });

  it('should handle an error when calling exemploErro', () => {
    service.exemploErro().subscribe(
      () => fail('should have failed with an error'),
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne('http://localhost:8080/api/produto/erro');
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  });
});