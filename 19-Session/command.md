1. pf flow test --flow 2.math --inputs number1=2 number2=2 2>/dev/null

(C:\Python312\python.exe -m promptflow._cli._pf.entry flow test --flow c:\MLOps\GenAIOps\19-Session\math  --inputs number_1=3 number_2=5 )


2.  C:\Python312\python.exe -m promptflow._cli._pf.entry flow build --source c:\MLOps\GenAIOps\19-Session\math --output ./dist --format docker

(build the docker file)

3. docker build .\dist\ -t math

4. docker run -p 8080:8080 math

5.  curl http://localhost:8080/score  --data '{ "number_1": 2, "number_2": 2}'

run on the docker image