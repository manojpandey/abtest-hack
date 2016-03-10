import requests
import time
import json
import sys, os
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException

def main():
	
	# driver = webdriver.Firefox()

	chromedriver = "/home/manoj/Downloads/chromedriver"
	os.environ["webdriver.chrome.driver"] = chromedriver
	driver = webdriver.Chrome(chromedriver)
	# pie
	# rolling
	i = 0
	while True:
		i = i +1
		if i&1:
			url = "https://mixpanel.com/report/900585/segmentation/#action:segment,arb_event:Session,bool_op:and,chart_type:pie,from_date:0,ms_checked:(green:!t,red:!t),ms_values:!(red,green),segfilter:!((dropdown_tab_index:0,property:(name:btn-abtest,source:properties,type:string),selected_property_type:string,type:string)),segment_type:string,to_date:0,type:general,unit:hour"
		else:
			url = "https://mixpanel.com/report/900585/segmentation/#action:segment,arb_event:Session,bool_op:and,chart_analysis_type:rolling,chart_type:line,from_date:0,ms_checked:(green:!t,red:!t),ms_values:!(red,green),segfilter:!((dropdown_tab_index:0,property:(name:btn-abtest,source:properties,type:string),selected_property_type:string,type:string)),segment_type:string,to_date:0,type:general,unit:hour"	

		driver.get(url)
		# xp = ".//*[@id='highcharts-2']"
		xp = '/html/body/div[1]/div/div[2]/div[4]/div[2]/div/div/div[2]/div[3]/div[2]'
		cl = 'highcharts-container'
		found = False
		while not found:
			try:
				# svgg = driver.find_elements_by_xpath(xp)
				elem = driver.find_element_by_class_name(cl)
				html = elem.get_attribute('innerHTML')
				# print html
				if i&1:
					f = open('templates/file.html', 'w')
				else:
					f = open('templates/pie.html', 'w')
				f.write(html)
				f.close()
				# print str(elem.text)
				found = True
			except NoSuchElementException:
				time.sleep(2)
		# send keys Ctrl+R
		time.sleep(8)
		driver.find_element_by_tag_name('body').send_keys(Keys.CONTROL + 'r')

if __name__ == '__main__':
	main()