/*
 * try to find wether 1+2+3+......+n tends to -/12
 * and why this limit is used for quantum physics
 */
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

long double doSigma(long double(*u)(int), int from, int to) {
	long double sigma = 0;
	for(int i = from; i <= to; i++) {
		sigma += u(i);
	}
	return sigma;
}

double precision;

long double delta(int i) {
	return (long double)((((long double)(rand())/RAND_MAX) -.5)/precision);
}

#define DELTA(i)  (long double)((((long double)(rand())/RAND_MAX) -.5)/precision)

long double u1(int i) {
	return DELTA(i) + (long double)(((i + 1)%2 == 0)?1.0:-1.0);
}

long double u2(int i) {
	return (long double)i*(1 + DELTA(i));
}



int main(int argc, char **argv) {
if (argc != 5) {
	fprintf(stderr, "Usage %s from to randomPrecision loop\n", argv[0]);
	return -1;
}
const int FROM = atoi(argv[1]);
const int TO = atoi(argv[2]);
precision = strtold(argv[3], NULL);
const int LOOP = atoi(argv[4]);

srand(time(0));

long double sigma[2];
long double mSigma[2] = {0.0, 0.0};

long double(*u)(int) = u2;

for (int i = 0; i < LOOP; i++) {
	time_t start = time(0);
	sigma[0] = doSigma(u, FROM, TO);
	sigma[1] = doSigma(u, FROM, TO + 1);
	printf("%ld(s)::doSygma(u) => %Lf::%Lf\n", (time(0) - start), sigma[0], sigma[1]);
	mSigma[0] += sigma[0];
	mSigma[1] += sigma[1];
}

printf("mSygma(u) => %Lf::%Lf\n", mSigma[0]/LOOP, mSigma[1]/LOOP);

}
