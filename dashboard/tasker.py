import requests
import time
import json
import sys
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException

def main():
	
	driver = webdriver.Firefox()

	url = "https://mixpanel.com/report/900585/segmentation/#action:segment,arb_event:Session,bool_op:and,chart_analysis_type:rolling,chart_type:line,from_date:0,ms_checked:(green:!t,red:!t),ms_values:!(red,green),segfilter:!((dropdown_tab_index:0,property:(name:btn-abtest,source:properties,type:string),selected_property_type:string,type:string)),segment_type:string,to_date:0,type:general,unit:hour"	

	driver.get(url)
	xp = ".//*[local-name()='svg']"
	
	found = False
	while not found:
		try:
			svgg = driver.find_element_by_xpath(xp)
			print "this works!!"
			print str(svgg.text)
			found = True
		except NoSuchElementException:
			time.sleep(2)

if __name__ == '__main__':
	main()