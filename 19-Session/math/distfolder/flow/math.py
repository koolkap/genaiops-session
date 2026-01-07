
from promptflow import tool


# The inputs section will change based on the arguments of the tool function, after you save the code
# Adding type to arguments and return value will help the system show the types properly
# Please update the function name/signature per need
@tool
def my_python_tool(input1: int, input2: int) -> int:
    result = input1 + input2
    return f'The sum of {input1} and {input2} is {result}'
