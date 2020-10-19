extends 'res://addons/gut/test.gd'

var ObjToTest = load('res://obj_to_test.gd')

func test_this_is_ok():
	var o  = ObjToTest.new()
	# We've decided it is ok for this method to return null here and that we do
	# not care about the script error.
	assert_null(o.is_param_the_number_1('a'))

func test_this_is_NOT_ok():
	var a  = 'a'
	if(a ==  1): # causes test to exit and our asserts are never called
		assert_eq(1,1)
	else:
		assert_eq(1,2)

func test_this_is_also_NOT_ok():
	assert_eq('1', '1') # this suppresses the warning since we did an assert
	var a  = 'a'
	if(a ==  1): # causes test to exit and our asserts are never called
		assert_eq(1,1)
	else:
		assert_eq(1,2)
